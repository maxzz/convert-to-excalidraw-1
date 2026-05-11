# Mermaid to Excalidraw Converter

This is a CLI utility that converts Mermaid diagrams embedded in Markdown files into separate `.excalidraw` files. It extracts all ` ```mermaid ... ``` ` blocks from the input file and generates corresponding Excalidraw diagrams.

## Installation

1. Navigate to this directory:
   ```bash
   cd convert-to-excalidraw-1
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the project (this compiles TypeScript and bundles the required browser libraries):
   ```bash
   pnpm run build
   ```
4. Install the CLI binary (so the `me2ex-conv` command + Windows `.cmd` wrapper are available):
   ```bash
   npm i -g .
   ```

## Usage

Run the CLI tool:

```bash
me2ex-conv -i <path-to-markdown-file> [options]
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
me2ex-conv -i ../../meta/docs/2026/my-doc.md
```
*If `my-doc.md` contains one diagram, it generates `my-doc.excalidraw`. If it contains multiple, it generates `my-doc-1.excalidraw`, `my-doc-2.excalidraw`, etc.*

**Specify output prefix:**
```bash
me2ex-conv -i my-doc.md -o output/diagram
```
*Generates `output/diagram-1.excalidraw`, etc.*

**Silent mode:**
```bash
me2ex-conv -i my-doc.md -s
```

## How it works

The tool uses Puppeteer (a headless browser) to run the `@excalidraw/mermaid-to-excalidraw` and `@excalidraw/excalidraw` libraries, which parse the Mermaid syntax and convert it to native Excalidraw elements. The `scripts/build.js` script automatically patches a known subgraph bug in the parser and bundles the browser dependencies into the `dist` folder.
