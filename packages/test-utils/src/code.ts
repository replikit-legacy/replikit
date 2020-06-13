export function code(template: TemplateStringsArray): string {
    const regex = /^(\s*).*$/gm;
    const text = template.raw[0];
    const lines = text.split("\n");
    const result = regex.exec(lines[1]);
    if (!result) {
        throw new Error("Invalid code snippet");
    }
    return lines
        .slice(1)
        .map(x => x.slice(result[1].length))
        .join("\n");
}
