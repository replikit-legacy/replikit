import { Command, text } from "@replikit/commands";
import { MessageBuilder } from "@replikit/messages";
import { CommandResult } from "@replikit/commands/typings";

export class EditCommand extends Command {
    name = "edit";

    text = text({ skipValidation: true });

    async execute(): Promise<CommandResult> {
        if (!this.message.reply) {
            return;
        }
        const message = new MessageBuilder()
            .useMetadata(this.message.reply.metadata)
            .addText(this.text)
            .addAttachments(this.message.attachments)
            .build();
        await this.controller.editMessage(this.channel.id, message);
    }
}
