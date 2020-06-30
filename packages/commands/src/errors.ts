import { Constructor } from "@replikit/core/typings";

export class MissingConverterError extends Error {
    constructor(type: Constructor) {
        super(`Converter for type ${type.name} not found`);
    }
}

export class InvalidConverterError extends Error {
    constructor(type: Constructor) {
        super(`Converter for type ${type.name} contains neither a validator nor a resolver`);
    }
}
