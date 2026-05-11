import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

function resolveBundlePath(baseDir: string, filename: string): string {
    const candidates = [
        path.join(baseDir, filename),
        path.join(baseDir, '..', 'dist', filename),
        path.join(process.cwd(), 'dist', filename)
    ];

    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }

    throw new Error(`Bundle file not found: ${filename}. Run "pnpm run build" first.`);
}

export async function convertMermaidToExcalidraw(mermaidCode: string, verbose: boolean): Promise<any> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const mermaidBundlePath = resolveBundlePath(__dirname, 'mermaid-to-excalidraw.bundle.iife.js');
    const excalidrawBundlePath = resolveBundlePath(__dirname, 'excalidraw.bundle.iife.js');
    const browser = await puppeteer.launch({ headless: true });

    try {
        const page = await browser.newPage();

        if (verbose) {
            page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        }

        await page.setContent('<!DOCTYPE html><html><body></body></html>');

        // Add scripts
        await page.addScriptTag({ path: mermaidBundlePath });
        await page.addScriptTag({ path: excalidrawBundlePath });

        const result = await page.evaluate(async (code) => {
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
        }, mermaidCode);

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
        await browser.close().catch(() => undefined);
    }
}
