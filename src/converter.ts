import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

export async function convertMermaidToExcalidraw(mermaidCode: string, verbose: boolean): Promise<any> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    if (verbose) {
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    }

    await page.setContent('<!DOCTYPE html><html><body></body></html>');

    // Add scripts
    await page.addScriptTag({ path: path.join(__dirname, 'mermaid-to-excalidraw.bundle.js') });
    await page.addScriptTag({ path: path.join(__dirname, 'excalidraw.bundle.js') });

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

    await browser.close();

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
}
