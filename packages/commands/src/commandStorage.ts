import { Command, CommandContext } from "@replikit/commands/typings";
import { MessageContext } from "@replikit/router";
import { MessageBuilder, fromCode } from "@replikit/messages";
import { MiddlewareStage, renderUsage, CommandsLocale } from "@replikit/commands";
import { NextHandler } from "@replikit/router/typings";

function chooseOverload(commands: Command[], args: string[]): Command | undefined {
    if (!commands.length) {
        return undefined;
    }
    if (commands.length === 1) {
        return commands[0];
    }
    return commands.reduce((x, y) => {
        const xdiff = Math.abs(x.requiredCount - args.length);
        const ydiff = Math.abs(y.requiredCount - args.length);
        return xdiff < ydiff ? x : y;
    });
}

function byName(name: string): (value: Command) => boolean {
    return (x): boolean => x.name === name || x.aliases.includes(name);
}

function byDefault(command: Command): (value: Command) => boolean {
    return (x): boolean => x.name === command.default;
}

function findCommand(command: Command, args: string[]): [Command | undefined, string[]] {
    const overloads = args.length ? command.commands.filter(byName(args[0])) : undefined;
    const cmdArgs = args.slice(1);
    const cmd = overloads ? chooseOverload(overloads, cmdArgs) : undefined;
    if (!cmd) {
        if (command.default) {
            const overloads = command.commands.filter(byDefault(command));
            const def = chooseOverload(overloads, args);
            return [def, args];
        }
        return [undefined, args];
    }
    return [cmd, cmdArgs];
}

function splitText(text: string): [string, string] {
    const newlineIndex = text.indexOf("\n");
    return newlineIndex === -1
        ? [text, ""]
        : [text.substr(0, newlineIndex), text.substr(newlineIndex + 1)];
}

export class CommandStorage {
    private readonly commands: Command[] = [];
    prefix = "/";

    getCommands(): Command[] {
        return this.commands;
    }

    private renderUsage(command: Command): void {
        command.usage = renderUsage(this.prefix, command);
        for (const subcommand of command.commands) {
            this.renderUsage(subcommand);
        }
    }

    register(command: Command): void {
        this.renderUsage(command);
        this.commands.push(command);
    }

    private async processCommand(
        context: MessageContext,
        command: Command,
        args: string[],
        text: string
    ): Promise<void> {
        const locale = context.getLocale(CommandsLocale);
        async function replyError(error: string): Promise<void> {
            const usage = locale.usage + " " + command.usage!;
            await context.reply(fromCode(error + "\n" + usage));
        }

        async function replyParameterError(error: string, name: string): Promise<void> {
            await replyError(`[${name}: ${error}]`);
        }

        if (!command.handler) {
            const [subcommand, newArgs] = findCommand(command, args);
            if (!subcommand) {
                return replyError(locale.commandNotFound);
            }
            return this.processCommand(context, subcommand, newArgs, text);
        }

        if (args.length < command.requiredCount) {
            return replyError(locale.mismatch(command.requiredCount, args.length));
        }

        const commandContext = context as CommandContext;
        commandContext.params = {};

        // Invoke prevalidation middleware
        if (command.middlewareRouter) {
            await command.middlewareRouter.process(
                MiddlewareStage.BeforeValidation,
                commandContext
            );
            if (!commandContext.skipped) {
                return;
            }
        }

        // Validate parameters
        for (const [i, param] of command.params.entries()) {
            const arg = args[i];
            if (!arg) {
                commandContext.params[param.name] = param.options.default;
                continue;
            }
            if (param.isString) {
                commandContext.params[param.name] = arg;
                continue;
            }
            if (!param.converter.validator) {
                continue;
            }
            const validationResult = param.converter.validator(context, arg, param.options);
            if (typeof validationResult === "string") {
                return replyParameterError(validationResult, param.name);
            }
            commandContext.params[param.name] = validationResult;
        }

        // Validate rest parameteres
        let restParameters: string[];
        if (command.rest) {
            restParameters = args.splice(command.params.length);
            const result: unknown[] = [];
            const minCount = command.rest.options.minCount;
            if (minCount && restParameters.length < minCount) {
                return replyParameterError(
                    locale.shouldBeNoLessParametersThan(minCount),
                    command.rest.name
                );
            }
            const maxCount = command.rest.options.maxCount;
            if (maxCount && restParameters.length > maxCount) {
                return replyParameterError(
                    locale.shouldBeNoMoreParametersThan(maxCount),
                    command.rest.name
                );
            }
            if (command.rest.isString) {
                result.push(...restParameters);
            } else if (command.rest.converter.validator) {
                for (const restParameter of restParameters) {
                    const validationResult = command.rest.converter.validator(
                        context,
                        restParameter,
                        command.rest.options
                    );
                    if (typeof validationResult === "string") {
                        return replyParameterError(validationResult, command.rest.name);
                    }
                    result.push(validationResult);
                }
            }
            commandContext.params[command.rest.name] = result;
        }

        // Parse text parameter
        if (command.text) {
            const textName = command.text.name ?? "text";
            if (command.rest) {
                commandContext.params[textName] = command.text.splitLines ? text.split("\n") : text;
            } else {
                const firstLine = args.slice(command.params.length).join(" ");
                const textValue = firstLine ? (text ? firstLine + "\n" + text : firstLine) : text;
                commandContext.params[textName] = command.text.splitLines
                    ? textValue.split("\n")
                    : textValue;
            }
            if (!command.text.skipValidation && !commandContext.params[textName]) {
                return replyParameterError(locale.emptyTextParameter, textName);
            }
        }

        // Invoke preresolution middleware
        if (command.middlewareRouter) {
            await command.middlewareRouter.process(
                MiddlewareStage.BeforeResolution,
                commandContext
            );
            if (!commandContext.skipped) {
                return;
            }
        }

        // Resolve parameters
        for (const [i, param] of command.params.entries()) {
            const arg = args[i];
            if (!arg || param.isString || !param.converter.resolver) {
                continue;
            }
            const resolutionResult = await param.converter.resolver(
                context,
                commandContext.params[param.name] ?? arg,
                param.options
            );
            if (typeof resolutionResult === "string") {
                return replyParameterError(resolutionResult, param.name);
            }
            commandContext.params[param.name] = resolutionResult;
        }

        // Handle rest params
        if (!command.rest?.isString && command.rest?.converter.resolver) {
            const result: unknown[] = [];
            for (const [i, restParameter] of restParameters!.entries()) {
                const rest = commandContext.params[command.rest.name];
                const validationResult = (rest as unknown[])[i];
                const resolutionResult = await command.rest.converter.resolver(
                    context,
                    validationResult ?? restParameter,
                    command.rest.options
                );
                if (typeof resolutionResult === "string") {
                    return replyParameterError(resolutionResult, command.rest.name);
                }
                result.push(resolutionResult);
            }
            commandContext.params[command.rest.name] = result;
        }

        if (command.middlewareRouter) {
            await command.middlewareRouter.process(MiddlewareStage.AfterResolution, commandContext);
            if (!commandContext.skipped) {
                return;
            }
        }

        // Invoke handler
        const result = await command.handler(commandContext);
        if (!result) {
            return;
        }

        const message = result instanceof MessageBuilder ? result.build() : result;
        await context.reply(message);
    }

    resolve(cmd: string): Command[] {
        return this.commands.filter(byName(cmd));
    }

    async process(context: MessageContext, next: NextHandler): Promise<unknown> {
        if (!context.message.text) {
            return next();
        }
        if (!context.message.text.startsWith(this.prefix)) {
            return next();
        }
        const [firstLine, text] = splitText(context.message.text);
        const partIterator = firstLine.replace(this.prefix, "").matchAll(/\s?"(.*?)"|\s?(\S+)\s?/g);
        const parts = Array.from(partIterator).map(x => x[1] ?? x[2]);
        // TODO somehow extract into the telegram module
        let commandName = parts[0];
        if (context.controller.name === "tg") {
            const items = commandName.split("@");
            if (items[1] === context.controller.botInfo.username) {
                commandName = items[0];
            }
        }
        const overloads = this.resolve(commandName);
        const args = parts.slice(1);
        const overload = chooseOverload(overloads, args);
        if (!overload) {
            return;
        }
        return this.processCommand(context, overload, args, text);
    }
}

export const commands = new CommandStorage();
