import {
    Converter,
    Resolver,
    Validator,
    ConverterBuilderFactory
} from "@replikit/commands/typings";
import { converters, ConverterStorage } from "@replikit/commands";
import { Constructor } from "@replikit/core/typings";

export class ConverterBuilder<T, V = string> {
    private readonly converter: Converter<T, V> = {};

    constructor(
        private readonly converters: ConverterStorage,
        private readonly type: Constructor<T>
    ) {}

    validator<V>(validator: Validator<T, V>): Omit<ConverterBuilder<T, V>, "validator">;

    validator<NV>(validator: Validator<T, NV>): this {
        this.converter.validator = (validator as unknown) as Validator<T, V>;
        return this;
    }

    resolver(resolver: Resolver<T, V>): Omit<this, "validator"> {
        this.converter.resolver = resolver;
        return this;
    }

    register(): void {
        this.converters.register(this.type, this.build());
    }

    build(): Converter {
        return this.converter as Converter;
    }
}

export function createConverterBuilderFactory(storage: ConverterStorage): ConverterBuilderFactory {
    return <T>(type: Constructor<T>): ConverterBuilder<T> => new ConverterBuilder(storage, type);
}

export const converter = createConverterBuilderFactory(converters);
