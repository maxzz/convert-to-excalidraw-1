import * as fs from 'node:fs';
import * as path from 'node:path';
import { createRequire } from 'node:module';
import { build } from 'tsdown';

const require = createRequire(import.meta.url);

// Resolve package entrypoints (using the package export entry, which avoids "exports" restrictions)
const mermaidEntryPoint = require.resolve('@excalidraw/mermaid-to-excalidraw');
const excalidrawEntryPoint = require.resolve('@excalidraw/excalidraw');

// Patch mermaid-to-excalidraw subgraph bug
const mermaidDistDir = path.dirname(mermaidEntryPoint);
const flowchartPath = path.join(mermaidDistDir, 'parser', 'flowchart.js');
const flowchartPathAlt = path.join(mermaidDistDir, 'parser', 'flowchart.mjs');
const flowchartToPatch = fs.existsSync(flowchartPath)
    ? flowchartPath
    : (fs.existsSync(flowchartPathAlt) ? flowchartPathAlt : null);

if (flowchartToPatch) {
    let content = fs.readFileSync(flowchartToPatch, 'utf8');
    content = content.replace(
        "const el = containerEl.querySelector(`[id='${data.id}']`);",
        "const el = containerEl.querySelector(`[id*=\"${data.id}\"]`);"
    );
    fs.writeFileSync(flowchartToPatch, content);
    console.log('Patched flowchart.js');
} else {
    console.warn('Could not find flowchart.js to patch');
}

// Ensure dist directory exists
const distDir = 'dist';
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

const buildBase = {
    outDir: distDir,
    format: 'esm',
    platform: 'browser',
    outputOptions: {
        inlineDynamicImports: true
    }
};

try {
    // Bundle mermaid-to-excalidraw
    await build({
        ...buildBase,
        entry: {
            'mermaid-to-excalidraw.bundle': mermaidEntryPoint
        },
        clean: true
    });
    console.log('Bundled mermaid-to-excalidraw');

    // Bundle excalidraw
    await build({
        ...buildBase,
        entry: {
            'excalidraw.bundle': excalidrawEntryPoint
        },
        clean: false
    });
    console.log('Bundled excalidraw');
} catch (err) {
    console.error('Failed to bundle browser dependencies:', err);
    process.exitCode = 1;
}
