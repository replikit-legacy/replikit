import { MessageContext } from "@replikit/router";
import { ParameterOptions } from "@replikit/commands/typings";

export type Validator<T = unknown, V = unknown> = (
    context: MessageContext,
    param: string,
    options: ParameterOptions<T>
) => V | string;

export type Resolver<T = unknown, V = unknown> = (
    context: MessageContext,
    param: V,
    options: ParameterOptions<T>
) => T | string | Promise<T | string>;

export interface Converter<T = unknown, V = unknown> {
    validator?: Validator<T, V>;
    resolver?: Resolver<T, V>;
}
