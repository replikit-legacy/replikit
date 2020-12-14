import { converter, CommandsLocale } from "@replikit/commands";
import { ConverterBuilderFactory } from "@replikit/commands/typings";

export function registerBasicConverters(converter: ConverterBuilderFactory): void {
    converter(Number)
        .validator((context, param, options) => {
            const locale = context.getLocale(CommandsLocale);
            if (options.float) {
                param = param.replace(",", ".");
            } else if (param.includes(",") || param.includes(".")) {
                return locale.integerRequired;
            }

            const result = options.float ? parseFloat(param) : parseInt(param);
            if (isNaN(result)) {
                return locale.numberRequired;
            }
            if (options.positive && result <= 0) {
                return locale.positiveNumberRequired;
            }
            if (options.min != null && result < options.min) {
                return locale.shouldBeNoLessThan(options.min);
            }
            if (options.max != null && result > options.max) {
                return locale.shouldBeNoMoreThan(options.max);
            }
            return result;
        })
        .register();

    converter(Boolean)
        .validator((context, param) => {
            switch (param.toLowerCase()) {
                case "true":
                    return true;
                case "false":
                    return false;
                default: {
                    const locale = context.getLocale(CommandsLocale);
                    return locale.booleanRequired;
                }
            }
        })
        .register();
}

registerBasicConverters(converter);
