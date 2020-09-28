import { command, CommandBuilder, NormalizeType, TextParameterOptions } from "@replikit/commands";
import {
    CommandContext,
    ParameterOptions,
    Command as CommandInfo,
    DefaultOptions,
    CommandResultAsync,
    Parameters,
    RestParameterOptions,
    Middleware
} from "@replikit/commands/typings";
import { assert, CompositionFactory, createCompositionInfo } from "@replikit/core";
import { Constructor } from "@replikit/core/typings";
import { MessageContext } from "@replikit/router";

export const commandComposer = new CompositionFactory<CommandBuilder, CommandContext>();

export function createParameterAccessor<T>(
    field: string
): (context: CommandContext<Parameters>) => NormalizeType<T> {
    return context => context.params[field] as NormalizeType<T>;
}

export function required<T>(type: Constructor<T>, options?: ParameterOptions<T>): NormalizeType<T> {
    return commandComposer.compose((builder, field) => {
        builder.required(field, type, options);
        return { get: createParameterAccessor(field) };
    });
}

export function text(options: TextParameterOptions & { splitLines: true }): string[];
export function text(options?: TextParameterOptions): string;

export function text(options?: TextParameterOptions): unknown {
    return commandComposer.compose((builder, field) => {
        builder.text(field, options);
        return { get: createParameterAccessor(field) };
    });
}

export function rest<T>(
    type: Constructor<T>,
    options?: RestParameterOptions<T>
): NormalizeType<T>[] {
    return commandComposer.compose((builder, field) => {
        builder.rest(field, type, options);
        return { get: createParameterAccessor<T[]>(field) };
    });
}

export function optional<T>(
    type: Constructor<T>,
    options?: ParameterOptions<T> & Required<DefaultOptions<T>>
): NormalizeType<T>;

export function optional<T>(
    type: Constructor<T>,
    options?: ParameterOptions<T>
): NormalizeType<T> | undefined;

export function optional<T>(
    type: Constructor<T>,
    options?: ParameterOptions<T>
): NormalizeType<T> | undefined {
    return commandComposer.compose((builder, field) => {
        builder.optional(field, type, options);
        return { get: createParameterAccessor<T>(field) };
    });
}

export type CommandLike = Constructor<Command> | Constructor<CommandContainer> | CommandInfo;

export function resolveCommand(commandLike: CommandLike): CommandInfo {
    if (typeof commandLike !== "function") {
        return commandLike;
    }

    const commandBuilder = command(undefined!);
    const compositionInfo = createCompositionInfo(commandLike, commandBuilder);
    const result = commandBuilder.build();

    result.name = compositionInfo.fields.name;
    assert(result.name, "Command name is required");

    result.compositionInfo = compositionInfo;
    result.aliases = compositionInfo.fields.aliases;

    if (compositionInfo.prototype instanceof CommandContainer) {
        const fields = compositionInfo.fields as CommandContainer;
        const commands = fields.commands;
        assert(commands, "Command array is required");
        result.commands = commands.map(resolveCommand);
        result.default = fields.default;
        return result;
    }

    interface CommandPrototype {
        execute(): CommandResultAsync;
    }

    commandBuilder.use(...(compositionInfo.fields as Command).middleware);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    commandBuilder.handler((compositionInfo.prototype as CommandPrototype).execute);
    return result;
}

abstract class CommandBase extends MessageContext {
    abstract name: string;
    aliases: string[] = [];
}

export abstract class Command extends CommandBase {
    abstract execute(): CommandResultAsync;
    middleware: Middleware[] = [];
}

export abstract class CommandContainer extends CommandBase {
    abstract commands: CommandLike[];
    default?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Command extends CommandContext {}
