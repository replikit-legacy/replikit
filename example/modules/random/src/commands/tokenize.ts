import { command } from "@replikit/commands";
import { fromCode } from "@replikit/messages";
import { CommandContext, CommandResult } from "@replikit/commands/typings";

command("tokenize")
    .handler(handler)
    .register();

function handler(context: CommandContext): CommandResult {
    const message = context.message.reply ?? context.message;
    const tokens = context.controller.tokenizeText(message);
    return fromCode(JSON.stringify(tokens, undefined, 2));
}
