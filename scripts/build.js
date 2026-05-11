import * as esbuild from 'esbuild';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createRequire } from 'node:module';

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
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Bundle mermaid-to-excalidraw
esbuild.buildSync({
    entryPoints: [mermaidEntryPoint],
    bundle: true,
    outfile: 'dist/mermaid-to-excalidraw.bundle.js',
    format: 'iife',
    globalName: 'mermaidToExcalidraw'
});
console.log('Bundled mermaid-to-excalidraw');

// Bundle excalidraw
esbuild.buildSync({
    entryPoints: [excalidrawEntryPoint],
    bundle: true,
    outfile: 'dist/excalidraw.bundle.js',
    format: 'iife',
    globalName: 'Excalidraw'
});
console.log('Bundled excalidraw');
