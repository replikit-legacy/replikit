/* eslint-disable @typescript-eslint/ban-types */
import {
    CommandContext,
    CommandHandler,
    Command,
    Parameters,
    ParameterOptions,
    MiddlewareHandler,
    Middleware,
    RestParameterOptions,
    CommandBuilder as _CommandBuilder
} from "@replikit/commands/typings";
import {
    converters,
    ConverterStorage,
    MiddlewareRouter,
    MiddlewareStage,
    CommandStorage,
    commands
} from "@replikit/commands";
import { Constructor, HasFields } from "@replikit/core/typings";

type NormalizeType<T> = T extends (infer U)[]
    ? NormalizeType<U>[]
    : T extends Number
    ? number
    : T extends String
    ? string
    : T extends Boolean
    ? boolean
    : T;

type Required<N extends string, T> = { [_ in N]: NormalizeType<T> };
type Optional<N extends string, T> = { [_ in N]?: NormalizeType<T> };

type AddRequired<C, P, N extends string, T> = CommandBuilder<
    C,
    P & Required<N, T>
>;

type AddOptional<C, P, N extends string, T> = CommandBuilder<
    C,
    P & Optional<N, T>
>;

interface Buildable {
    build(): Command;
}

type CommandLike = Command | Buildable;

export class CommandBuilder<C = HasFields, P extends Parameters = HasFields> {
    protected readonly command: Command;

    constructor(
        private readonly commandStorage: CommandStorage,
        private readonly converters: ConverterStorage,
        name: string,
        ...aliases: string[]
    ) {
        this.command = {
            name,
            commands: [],
            params: [],
            requiredCount: 0,
            aliases
        };
    }

    use(...middleware: Middleware[]): this;
    use(stage: MiddlewareStage, ...handlers: MiddlewareHandler[]): this;

    use(...args: unknown[]): this {
        if (!this.command.middlewareRouter) {
            this.command.middlewareRouter = new MiddlewareRouter();
        }
        if (typeof args[0] !== "number") {
            for (const middleware of args) {
                this.command.middlewareRouter.add(middleware as Middleware);
            }
            return this;
        }
        for (const handler of args.slice(1)) {
            this.command.middlewareRouter.add({
                stage: args[0],
                handler: handler as MiddlewareHandler
            });
        }
        return this;
    }

    required<N extends string, T>(
        name: N,
        type: Constructor<T>,
        options?: ParameterOptions<T>
    ): AddRequired<C, P, N, T>;

    required(
        name: string,
        type: Constructor,
        options: ParameterOptions = {} as ParameterOptions
    ): this {
        this.command.requiredCount++;
        if (type === String) {
            this.command.params.push({ isString: true, name, options });
            return this;
        }
        this.command.params.push({
            isString: false,
            name,
            type,
            options,
            converter: this.converters.resolve(type)
        });
        return this;
    }

    optional<N extends string, T>(
        name: N,
        type: Constructor<T>,
        options: ParameterOptions<T> & { default: T }
    ): Omit<AddRequired<C, P, N, T>, "required">;

    optional<N extends string, T>(
        name: N,
        type: Constructor<T>,
        options?: ParameterOptions<T>
    ): Omit<AddOptional<C, P, N, T>, "required">;

    optional(
        name: string,
        type: Constructor,
        options: ParameterOptions = {} as ParameterOptions
    ): this {
        if (type === String) {
            this.command.params.push({
                isString: true,
                name,
                options,
                optional: true
            });
            return this;
        }
        this.command.params.push({
            isString: false,
            name,
            type,
            options: options,
            converter: this.converters.resolve(type),
            optional: true
        });
        return this;
    }

    rest<N extends string, T>(
        name: N,
        type: Constructor<T>,
        options?: RestParameterOptions<T>
    ): Omit<AddRequired<C, P, N, T[]>, "rest">;

    rest(
        name: string,
        type: Constructor,
        options: RestParameterOptions = {} as RestParameterOptions
    ): unknown {
        if (type === String) {
            this.command.rest = { isString: true, name, options };
            return this;
        }
        this.command.rest = {
            isString: false,
            name,
            type,
            options,
            converter: this.converters.resolve(type)
        };
        return this;
    }

    text<N extends string>(
        name: N,
        splitLines: true,
        skipValidation?: true
    ): AddRequired<C, P, N, string[]>;

    text<N extends string>(
        name: N,
        splitLines: false,
        skipValidation: true
    ): AddRequired<C, P, N, string>;

    text<N extends string>(name: N): AddRequired<C, P, N, string>;

    text(): AddRequired<C, P, "text", string>;

    text(
        splitLines: false,
        skipValidation: true
    ): AddRequired<C, P, "text", string>;

    text(
        splitLines: true,
        skipValidation?: true
    ): AddRequired<C, P, "text", string[]>;

    text(
        name?: string | boolean,
        splitLines?: boolean,
        skipValidation?: true
    ): unknown {
        this.command.text =
            typeof name === "string"
                ? { name, splitLines, skipValidation }
                : { splitLines: name, skipValidation: splitLines };
        return this;
    }

    default(defaultCommand: string): this {
        this.command.default = defaultCommand;
        return this;
    }

    commands(...commands: CommandLike[]): Pick<this, "build" | "register"> {
        this.command.commands = commands.map(x => {
            const command =
                x instanceof CommandBuilder ? x.build() : (x as Command);
            command.parent = this.command;
            return command;
        });
        return this;
    }

    handler(
        handler: CommandHandler<C & CommandContext<P>>
    ): Pick<this, "build" | "register"> {
        this.command.handler = handler as CommandHandler;
        return this;
    }

    register(): void {
        this.commandStorage.register(this.build());
    }

    build(): Command {
        return this.command;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CommandBuilder<
    C = HasFields,
    P extends Parameters = HasFields
> extends _CommandBuilder<C, P> {}

export type CommandBuilderFactory = (
    name: string,
    ...aliases: string[]
) => CommandBuilder;

export function createCommandBuilderFactory(
    commands: CommandStorage,
    converters: ConverterStorage
): CommandBuilderFactory {
    return (name: string, ...aliases): CommandBuilder =>
        new CommandBuilder(commands, converters, name, ...aliases);
}

export const command = createCommandBuilderFactory(commands, converters);
