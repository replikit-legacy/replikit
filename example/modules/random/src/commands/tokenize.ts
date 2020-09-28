import { Command } from "@replikit/commands";
import { fromCode } from "@replikit/messages";
import { CommandResult } from "@replikit/commands/typings";

export class TokenizeCommand extends Command {
    name = "tokenize";

    execute(): CommandResult {
        const message = this.message.reply ?? this.message;
        const tokens = this.controller.tokenizeText(message);
        return fromCode(JSON.stringify(tokens, undefined, 2));
    }
}
