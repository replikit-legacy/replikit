import { command } from "@replikit/commands";
import { MessageBuilder } from "@replikit/messages";

command("echo")
    .handler(context => {
        const tokens = context.controller.tokenizeText(context.message);
        return new MessageBuilder()
            .addTokens(tokens)
            .addAttachments(context.message.attachments)
            .addReply(context.message.reply?.id);
    })
    .register();
