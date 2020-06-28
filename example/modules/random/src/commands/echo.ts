import { command } from "@replikit/commands";
import { MessageBuilder } from "@replikit/messages";

command("echo")
    .handler(context => {
        const tokens = context.controller.tokenizeText(context.message);
        const builder = new MessageBuilder()
            .addTokens(tokens)
            .addAttachments(context.message.attachments);
        if (context.message.reply) {
            builder.addReply(context.message.reply.metadata);
        }
        return builder;
    })
    .register();
