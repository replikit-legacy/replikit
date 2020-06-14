import { formatPlural } from "@replikit/i18n";

export const ru = {
    plural(value: number, one: string, few: string, many?: string): string {
        const abs = Math.abs(value);
        const h = abs % 100;
        if (h >= 11 && h <= 20) {
            return formatPlural(many ?? few, value);
        }
        switch (abs % 10) {
            case 1:
                return formatPlural(one, value);
            case 2:
            case 3:
            case 4:
                return formatPlural(few, value);
            default:
                return formatPlural(many ?? few, value);
        }
    }
};
