import { Command } from 'commander';

const program = new Command();

program
  .name('me2ex-conv')
  .description('CLI to convert Mermaid diagrams in Markdown to Excalidraw files')
  .version('1.0.0')
  .requiredOption('-i, --input <file>', 'Input Markdown file')
  .option('-o, --output <prefix>', 'Output file prefix (default: input file name without extension)')
  .option('-s, --silent', 'Disable console output')
  .option('-v, --verbose', 'Enable verbose logging')
  .parse(process.argv);

export const options = program.opts<{
  input: string;
  output?: string;
  silent?: boolean;
  verbose?: boolean;
}>();
