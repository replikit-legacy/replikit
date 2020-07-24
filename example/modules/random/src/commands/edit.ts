import { command } from "@replikit/commands";
import { MessageBuilder } from "@replikit/messages";
import { CommandContext, CommandResult } from "@replikit/commands/typings";
import { useText } from "@replikit/hooks";

command("edit")
    .handler(handler)
    .register();

async function handler(context: CommandContext): Promise<CommandResult> {
    const text = useText({ skipValidation: true });
    if (!context.message.reply) {
        return;
    }
    const message = new MessageBuilder()
        .useMetadata(context.message.reply.metadata)
        .addText(text)
        .addAttachments(context.message.attachments)
        .build();
    await context.controller.editMessage(context.channel.id, message);
}
