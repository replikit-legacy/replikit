/* eslint-disable @typescript-eslint/no-unused-vars */

import { Constructor } from "@replikit/core/typings";
import { ParameterOptions, CommandContext, RestParameterOptions } from "@replikit/commands/typings";
import { useContext } from "@replikit/hooks";
import { NormalizeType, TextParameterOptions } from "@replikit/commands";
import { LocaleConstructor } from "@replikit/i18n/typings";

export function useCommandContext(): CommandContext {
    return useContext() as CommandContext;
}

export function useRequired<T>(
    name: string,
    type: Constructor<T>,
    options?: ParameterOptions<T>
): NormalizeType<T> {
    const context = useCommandContext();
    return context.params[name] as NormalizeType<T>;
}

export function useOptional<T>(
    name: string,
    type: Constructor<T>,
    options: ParameterOptions<T> & { default: T }
): NormalizeType<T>;

export function useOptional<T>(
    name: string,
    type: Constructor<T>,
    options?: ParameterOptions<T>
): NormalizeType<T> | undefined;

export function useOptional<T>(
    name: string,
    type: Constructor<T>,
    options?: ParameterOptions<T>
): NormalizeType<T> | undefined {
    const context = useCommandContext();
    return context.params[name] as NormalizeType<T>;
}

export function useText(name?: string, options?: TextParameterOptions): string;
export function useText(options: TextParameterOptions): string;

export function useText(
    name?: string | TextParameterOptions,
    options?: TextParameterOptions
): string {
    const context = useCommandContext();
    const propName = typeof name === "string" ? name : "text";
    return context.params[propName] as string;
}

export function useRest<T>(
    name: string,
    type: Constructor<T>,
    options: RestParameterOptions<T>
): NormalizeType<T>[] {
    const context = useCommandContext();
    return context.params[name] as NormalizeType<T>[];
}

export function useLocale<T>(type: LocaleConstructor<T>): T {
    const context = useContext();
    return context.getLocale(type);
}
