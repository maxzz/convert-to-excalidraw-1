#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { extractMermaidDiagrams } from './extractor';
import { convertMermaidToExcalidraw } from './converter';

const program = new Command();

program
  .name('convert-to-excalidraw')
  .description('CLI to convert Mermaid diagrams in Markdown to Excalidraw files')
  .version('1.0.0')
  .requiredOption('-i, --input <file>', 'Input Markdown file')
  .option('-o, --output <prefix>', 'Output file prefix (default: input file name without extension)')
  .option('-s, --silent', 'Disable console output')
  .option('-v, --verbose', 'Enable verbose logging')
  .parse(process.argv);

const options = program.opts();

async function main() {
    const inputPath = path.resolve(options.input);
    if (!fs.existsSync(inputPath)) {
        console.error(`Error: Input file ${inputPath} does not exist.`);
        process.exit(1);
    }

    const markdown = fs.readFileSync(inputPath, 'utf8');
    const diagrams = extractMermaidDiagrams(markdown);

    if (diagrams.length === 0) {
        if (!options.silent) console.log('No Mermaid diagrams found in the input file.');
        return;
    }

    if (!options.silent) console.log(`Found ${diagrams.length} Mermaid diagram(s).`);

    const outputPrefix = options.output
        ? path.resolve(options.output)
        : path.join(path.dirname(inputPath), path.basename(inputPath, path.extname(inputPath)));

    for (let i = 0; i < diagrams.length; i++) {
        const diagram = diagrams[i];
        const outPath = diagrams.length === 1 && options.output
            ? `${outputPrefix}.excalidraw`
            : diagrams.length === 1 && !options.output
                ? `${outputPrefix}.excalidraw`
                : `${outputPrefix}-${i + 1}.excalidraw`;

        if (!options.silent) console.log(`Converting diagram ${i + 1}/${diagrams.length}...`);

        try {
            const excalidrawJson = await convertMermaidToExcalidraw(diagram, options.verbose);
            fs.writeFileSync(outPath, JSON.stringify(excalidrawJson, null, 2));
            if (!options.silent) console.log(`Saved: ${outPath}`);
        } catch (err: any) {
            console.error(`Failed to convert diagram ${i + 1}:`, err.message);
        }
    }

    if (!options.silent) console.log('Done!');
}

main().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
