/* eslint-disable @typescript-eslint/ban-types */

import { FilterKeys } from "@replikit/core/typings";
import {
    NumberParameterOptions,
    StringParameterOptions,
    BooleanParameterOptions,
    CommandContext
} from "@replikit/commands/typings";

export interface ParameterOptionMap {
    Number: [Number, NumberParameterOptions];
    String: [String, StringParameterOptions];
    Boolean: [Boolean, BooleanParameterOptions];
}

type ResolveOptions<T> = ParameterOptionMap[FilterKeys<ParameterOptionMap, [T, unknown]>][1];

type Options<T> = ResolveOptions<T> extends never ? object : ResolveOptions<T>;

export type DefaultResolver<T> = (
    context: CommandContext
) => T | Promise<T> | T[] | Promise<T[]> | string | Promise<string>;

interface DefaultOptions<T> {
    default?: T | DefaultResolver<T>;
}

interface RestOptions {
    minCount?: number;
    maxCount?: number;
}

export type ParameterOptions<T = unknown> = DefaultOptions<T> & Options<T>;
export type RestParameterOptions<T = unknown> = RestOptions & Options<T>;
