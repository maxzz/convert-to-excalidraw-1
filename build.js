const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Patch mermaid-to-excalidraw subgraph bug
const flowchartPath = path.join(__dirname, 'node_modules', '@excalidraw', 'mermaid-to-excalidraw', 'dist', 'parser', 'flowchart.js');
if (fs.existsSync(flowchartPath)) {
    let content = fs.readFileSync(flowchartPath, 'utf8');
    content = content.replace(
        "const el = containerEl.querySelector(`[id='${data.id}']`);",
        "const el = containerEl.querySelector(`[id*=\"${data.id}\"]`);"
    );
    fs.writeFileSync(flowchartPath, content);
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
    entryPoints: ['node_modules/@excalidraw/mermaid-to-excalidraw/dist/index.js'],
    bundle: true,
    outfile: 'dist/mermaid-to-excalidraw.bundle.js',
    format: 'iife',
    globalName: 'mermaidToExcalidraw'
});
console.log('Bundled mermaid-to-excalidraw');

// Bundle excalidraw
esbuild.buildSync({
    entryPoints: ['node_modules/@excalidraw/excalidraw/dist/excalidraw.production.min.js'],
    bundle: true,
    outfile: 'dist/excalidraw.bundle.js',
    format: 'iife',
    globalName: 'Excalidraw'
});
console.log('Bundled excalidraw');
