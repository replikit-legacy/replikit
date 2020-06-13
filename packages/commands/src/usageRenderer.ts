import { Command, CommandParameter } from "@replikit/commands/typings";

function resolveFullCommand(command: Command): string {
    let fullCommand = command.name;
    let commandBuf = command.parent;
    while (commandBuf) {
        fullCommand = commandBuf.name + " " + fullCommand;
        commandBuf = commandBuf.parent!;
    }
    return fullCommand;
}

function renderParameters(parameters: CommandParameter[]): string {
    if (!parameters.length) {
        return "";
    }
    const params = parameters
        .map(x => (x.optional ? `[${x.name}]` : `{${x.name}}`))
        .join(" ");
    return " " + params;
}

export function renderUsage(prefix: string, command: Command): string {
    const parameters = command.handler
        ? renderParameters(command.params)
        : ` {${command.commands.map(x => x.name).join("|")}}`;
    const fullCommand = resolveFullCommand(command);
    const rest = command.rest ? ` ...${command.rest.name}` : "";
    return `${prefix}${fullCommand}${parameters}${rest}`;
}
