import { command } from "@replikit/commands";
import { MessageBuilder } from "@replikit/messages";
import { CommandContext, CommandResult } from "@replikit/commands/typings";

command("echo")
    .handler(handler)
    .register();

function handler(context: CommandContext): CommandResult {
    const tokens = context.controller.tokenizeText(context.message);
    const builder = new MessageBuilder()
        .addTokens(tokens)
        .addAttachments(context.message.attachments);
    if (context.message.reply) {
        builder.addReply(context.message.reply.metadata);
    }
    if (context.message.text?.includes("header")) {
        builder.addHeader({
            username: "Replikit Echo",
            avatar: "https://sntch.com/uploads/2018/07/original.jpg"
        });
    }
    return builder;
}
