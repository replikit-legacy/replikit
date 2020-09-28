import { Command } from "@replikit/commands";
import { CommandResult } from "@replikit/commands/typings";

export class DeleteCommand extends Command {
    name = "delete";

    async execute(): Promise<CommandResult> {
        const reply = this.message.reply;
        if (!reply) {
            return;
        }
        const permissions = this.message.channel.permissions;
        const canDeleteOthers = permissions.deleteOtherMessages;
        const canDeleteOwn = permissions.deleteMessages;
        const owns = reply.account.id === this.controller.botInfo.id;
        if (canDeleteOthers || (owns && canDeleteOwn)) {
            await this.controller.deleteMessage(this.channel.id, reply.metadata);
            if (canDeleteOthers) {
                await this.controller.deleteMessage(this.channel.id, this.message.metadata);
            }
        }
    }
}
