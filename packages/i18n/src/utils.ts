export function formatPlural(text: string, count: number): string {
    return text.replace("$", count.toString());
}
