import { command } from "@replikit/commands";
import { MessageBuilder } from "@replikit/messages";

command("edit")
    .text({ skipValidation: true })
    .handler(async context => {
        if (!context.message.reply) {
            return;
        }
        const message = new MessageBuilder()
            .useMetadata(context.message.reply.metadata)
            .addText(context.params.text)
            .addAttachments(context.message.attachments)
            .build();
        await context.controller.editMessage(context.channel.id, message);
        return;
    })
    .register();
