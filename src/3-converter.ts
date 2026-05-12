import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'url';

function resolveBundlePath(baseDir: string, filenames: string[]): string {
    const candidates = filenames.flatMap(
        (filename) => ([
            path.join(baseDir, filename),
            path.join(baseDir, '..', 'dist', filename),
            path.join(process.cwd(), 'dist', filename)
        ])
    );

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    throw new Error(`Bundle file not found. Run "pnpm run build" first.`);
}

function createModuleLoaderHtml(mermaidBundleUrl: string, excalidrawBundleUrl: string): string {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
  </head>
  <body>
    <script type="module">
      import * as mermaidToExcalidraw from ${JSON.stringify(mermaidBundleUrl)};
      import * as Excalidraw from ${JSON.stringify(excalidrawBundleUrl)};
      window.mermaidToExcalidraw = mermaidToExcalidraw;
      window.Excalidraw = Excalidraw;
    </script>
  </body>
</html>`;
}

function resolveLoaderPaths(baseDir: string): {
    mermaidBundleUrl: string;
    excalidrawBundleUrl: string;
    htmlPath: string;
} {
    const mermaidBundlePath = resolveBundlePath(baseDir, [
        'mermaid-to-excalidraw.bundle.js',
        'mermaid-to-excalidraw.bundle.mjs'
    ]);
    const excalidrawBundlePath = resolveBundlePath(baseDir, [
        'excalidraw.bundle.js',
        'excalidraw.bundle.mjs'
    ]);
    const mermaidBundleUrl = pathToFileURL(mermaidBundlePath).href;
    const excalidrawBundleUrl = pathToFileURL(excalidrawBundlePath).href;
    const distDir = path.dirname(mermaidBundlePath);
    const htmlPath = path.join(distDir, `.me2ex-loader-${process.pid}-${Date.now()}.html`);

    return { mermaidBundleUrl, excalidrawBundleUrl, htmlPath };
}

export async function convertMermaidToExcalidraw(mermaidCode: string, verbose: boolean): Promise<any> {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const { mermaidBundleUrl, excalidrawBundleUrl, htmlPath } = resolveLoaderPaths(__dirname);

    const browser = await puppeteer.launch({ headless: true, args: ['--allow-file-access-from-files'] });

    try {
        const page = await browser.newPage();

        if (verbose) {
            page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        }

        fs.writeFileSync(htmlPath, createModuleLoaderHtml(mermaidBundleUrl, excalidrawBundleUrl), 'utf8');

        await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' });
        await page.waitForFunction(
            () => {
                return Boolean((window as any).mermaidToExcalidraw && (window as any).Excalidraw);
            },
            { timeout: 60000 });

        const result = await page.evaluate(
            async (code) => {
                try {
                    const { elements, files } = await (window as any).mermaidToExcalidraw.parseMermaidToExcalidraw(code, {
                        fontSize: 20,
                    });

                    // Convert skeleton elements to actual Excalidraw elements
                    const convertedElements = (window as any).Excalidraw.convertToExcalidrawElements(elements);

                    return { elements: convertedElements, files };
                } catch (e: any) {
                    return { error: e.toString() };
                }
            },
            mermaidCode);

        if (result.error) {
            throw new Error(result.error);
        }

        return {
            type: "excalidraw",
            version: 2,
            source: "mermaid-to-excalidraw",
            elements: result.elements,
            appState: { viewBackgroundColor: "#ffffff" },
            files: result.files || {}
        };
    } finally {
        fs.rmSync(htmlPath, { force: true });

        await browser.close().catch(() => undefined);
    }
}
