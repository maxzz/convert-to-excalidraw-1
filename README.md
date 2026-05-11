# Mermaid to Excalidraw Converter

This is a CLI utility that converts Mermaid diagrams embedded in Markdown files into separate `.excalidraw` files. It extracts all ` ```mermaid ... ``` ` blocks from the input file and generates corresponding Excalidraw diagrams.

## Installation

1. Navigate to this directory:
   ```bash
   cd scripts/convert-to-excalidraw-1
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project (this compiles TypeScript and bundles the required browser libraries):
   ```bash
   npm run build
   ```

## Usage

Run the CLI tool using Node.js:

```bash
node dist/index.js -i <path-to-markdown-file> [options]
```

### Options

- `-i, --input <file>` (Required): Path to the input Markdown file containing Mermaid diagrams.
- `-o, --output <prefix>`: Output file prefix. If omitted, the tool uses the input file name (without extension).
- `-s, --silent`: Disable console output.
- `-v, --verbose`: Enable verbose logging (useful for debugging browser errors).
- `-h, --help`: Display help for command.

### Examples

**Basic conversion:**
```bash
node dist/index.js -i ../../meta/docs/2026/my-doc.md
```
*If `my-doc.md` contains one diagram, it generates `my-doc.excalidraw`. If it contains multiple, it generates `my-doc-1.excalidraw`, `my-doc-2.excalidraw`, etc.*

**Specify output prefix:**
```bash
node dist/index.js -i my-doc.md -o output/diagram
```
*Generates `output/diagram-1.excalidraw`, etc.*

**Silent mode:**
```bash
node dist/index.js -i my-doc.md -s
```

## How it works

The tool uses Puppeteer (a headless browser) to run the `@excalidraw/mermaid-to-excalidraw` and `@excalidraw/excalidraw` libraries, which parse the Mermaid syntax and convert it to native Excalidraw elements. The `build.js` script automatically patches a known subgraph bug in the parser and bundles the browser dependencies into the `dist` folder.
