import { formatPlural } from "@replikit/i18n";

export const ru = {
    plural(value: number, one: string, few: string, many?: string): string {
        const h = value % 100;
        if (h >= 11 && h <= 20) {
            return formatPlural(many ?? few, value);
        }
        switch (value % 10) {
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
