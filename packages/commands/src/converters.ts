import { converter } from "@replikit/commands";
import { ConverterBuilderFactory } from "@replikit/commands/typings";

export function registerBasicConverters(converter: ConverterBuilderFactory): void {
    converter(Number)
        .validator((context, param, options) => {
            if (options.float) {
                param = param.replace(",", ".");
            } else if (param.includes(",") || param.includes(".")) {
                return context.t.commands.integerRequired;
            }

            const result = options.float ? parseFloat(param) : parseInt(param);
            if (isNaN(result)) {
                return context.t.commands.numberRequired;
            }
            if (options.positive && result <= 0) {
                return context.t.commands.positiveNumberRequired;
            }
            if (options.min && result < options.min) {
                return context.t.commands.shouldBeNoLessThan(options.min);
            }
            if (options.max && result > options.max) {
                return context.t.commands.shouldBeNoMoreThan(options.max);
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
                default:
                    return context.t.commands.booleanRequired;
            }
        })
        .register();
}

registerBasicConverters(converter);
