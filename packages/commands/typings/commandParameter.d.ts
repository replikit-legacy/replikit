import {
    ParameterOptions,
    Converter,
    RestParameterOptions
} from "@replikit/commands/typings";
import { Constructor } from "@replikit/core/typings";

interface CommandParameterBase<O> {
    name: string;
    options: O;
    optional?: true;
}

interface StringCommandParameter<O> extends CommandParameterBase<O> {
    isString: true;
}

interface TypedCommandParameter<T, O> extends CommandParameterBase<O> {
    isString: false;
    type: Constructor;
    converter: Converter<T>;
}

export type CommandParameter<T = unknown> =
    | StringCommandParameter<ParameterOptions<T>>
    | TypedCommandParameter<T, ParameterOptions<T>>;

export type RestCommandParameter<T = unknown> =
    | StringCommandParameter<RestParameterOptions<T>>
    | TypedCommandParameter<T, RestParameterOptions<T>>;

export interface TextCommandParameter {
    name?: string;
    skipValidation?: boolean;
    splitLines?: boolean;
}
