/* eslint-disable @typescript-eslint/no-unused-vars */

import { Constructor } from "@replikit/core/typings";
import { ParameterOptions, CommandContext, RestParameterOptions } from "@replikit/commands/typings";
import { useContext } from "@replikit/hooks";
import { NormalizeType, TextParameterOptions, CommandBuilder } from "@replikit/commands";
import { Channel } from "@replikit/storage";
import { ModuleNotFoundError } from "@replikit/core";

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

useRequired.build = (builder: CommandBuilder, args: Parameters<typeof useRequired>) => {
    return builder.required(...args);
};

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

useOptional.build = (builder: CommandBuilder, args: Parameters<typeof useOptional>) => {
    return builder.optional(...args);
};

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

useText.build = (builder: CommandBuilder, args: Parameters<typeof useText>) => {
    return builder.text(...args);
};

export function useRest<T>(
    name: string,
    type: Constructor<T>,
    options?: RestParameterOptions<T>
): NormalizeType<T>[] {
    const context = useCommandContext();
    return context.params[name] as NormalizeType<T>[];
}

useRest.build = (builder: CommandBuilder, args: Parameters<typeof useRest>) => {
    return builder.rest(...args);
};

export function useChannel(name?: string): Channel {
    const context = useCommandContext();
    return context.params[name ?? "channel"] as Channel;
}

useChannel.build = (builder: CommandBuilder, args: Parameters<typeof useChannel>) => {
    if (!builder.channel) {
        throw new ModuleNotFoundError("@replikit/storage", "useChannel hook");
    }
    return builder.channel(args[0] as string);
};
