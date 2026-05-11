#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import pc from 'picocolors';
import { options } from './1-cli-options.js';
import { extractMermaidDiagrams } from './2-extractor.js';
import { convertMermaidToExcalidraw } from './3-converter.js';

async function main() {
    const inputPath = path.resolve(options.input);
    if (!fs.existsSync(inputPath)) {
        console.error(pc.red(`Error: Input file ${inputPath} does not exist.`));
        process.exit(1);
    }

    const markdown = fs.readFileSync(inputPath, 'utf8');
    const diagrams = extractMermaidDiagrams(markdown);

    if (diagrams.length === 0) {
        if (!options.silent) console.log(pc.yellow('No Mermaid diagrams found in the input file.'));
        return;
    }

    if (!options.silent) {
        console.log(pc.cyan(`Found ${diagrams.length} Mermaid diagram(s).`));
    }

    const outputPrefix = options.output
        ? path.resolve(options.output)
        : path.join(path.dirname(inputPath), path.basename(inputPath, path.extname(inputPath)));

    // Create output directory if more then one file is being generated and it doesn't exist and redirect generated files to the output directory

    let outputPath = outputPrefix;

    if (diagrams.length > 1 && !fs.existsSync(path.dirname(outputPrefix))) {
        fs.mkdirSync(path.dirname(outputPrefix));
        outputPath = path.dirname(outputPrefix);
    }

    // Loop through all diagrams and convert them to Excalidraw

    for (let i = 0; i < diagrams.length; i++) {
        const diagram = diagrams[i];
        const outPath = diagrams.length === 1 && options.output
            ? `${outputPath}.excalidraw`
            : diagrams.length === 1 && !options.output
                ? `${outputPath}.excalidraw`
                : `${outputPath}-${i + 1}.excalidraw`;

        if (!options.silent) {
            console.log(pc.yellow(`Converting diagram ${i + 1}/${diagrams.length}...`));
        }

        try {
            const excalidrawJson = await convertMermaidToExcalidraw(diagram, options.verbose ?? false);
            fs.writeFileSync(outPath, JSON.stringify(excalidrawJson, null, 2));
            if (!options.silent) console.log(pc.green(`Saved: ${outPath}`));
        } catch (err: any) {
            console.error(pc.red(`Failed to convert diagram ${i + 1}: ${err.message}`));
        }
    }

    if (!options.silent) console.log(pc.green('Done!'));
}

main().catch(err => {
    console.error(pc.red(`Unexpected error: ${err}`));
    process.exit(1);
});
