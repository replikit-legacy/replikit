import { Command } from "@replikit/commands";
import { MessageBuilder } from "@replikit/messages";
import { CommandResult } from "@replikit/commands/typings";

export class EchoCommand extends Command {
    name = "echo";

    execute(): CommandResult {
        const tokens = this.controller.tokenizeText(this.message);
        const builder = new MessageBuilder()
            .addTokens(tokens)
            .addAttachments(this.message.attachments);
        if (this.message.reply) {
            builder.addReply(this.message.reply.metadata);
        }
        if (this.message.text?.includes("header")) {
            builder.addHeader({
                username: "Replikit Echo",
                avatar: "https://sntch.com/uploads/2018/07/original.jpg"
            });
        }
        return builder;
    }
}
