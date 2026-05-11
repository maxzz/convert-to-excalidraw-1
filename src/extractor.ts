export function extractMermaidDiagrams(markdown: string): string[] {
    const regex = /```mermaid\n([\s\S]*?)\n```/g;
    const diagrams: string[] = [];
    let match;
    while ((match = regex.exec(markdown)) !== null) {
        diagrams.push(match[1].trim());
    }
    return diagrams;
}
