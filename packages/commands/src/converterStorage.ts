import { Converter } from "@replikit/commands/typings";
import { MissingConverterError } from "@replikit/commands";
import { Constructor } from "@replikit/core/typings";

export class ConverterStorage {
    private readonly converterMap = new Map<Constructor, Converter>();

    register(type: Constructor, converter: Converter): void {
        this.converterMap.set(type, converter);
    }

    resolve<T>(type: Constructor<T>): Converter {
        const converter = this.converterMap.get(type);
        if (!converter) {
            throw new MissingConverterError(type);
        }
        return converter;
    }
}

export const converters = new ConverterStorage();
