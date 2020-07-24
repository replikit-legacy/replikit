import { command } from "@replikit/commands";
import { CommandContext, CommandResult } from "@replikit/commands/typings";

command("delete")
    .handler(handler)
    .register();

async function handler(context: CommandContext): Promise<CommandResult> {
    const reply = context.message.reply;
    if (!reply) {
        return;
    }
    const permissions = context.message.channel.permissions;
    const canDeleteOthers = permissions.deleteOtherMessages;
    const canDeleteOwn = permissions.deleteMessages;
    const owns = reply.account.id === context.controller.botInfo.id;
    if (canDeleteOthers || (owns && canDeleteOwn)) {
        await context.controller.deleteMessage(context.channel.id, reply.metadata);
        if (canDeleteOthers) {
            await context.controller.deleteMessage(context.channel.id, context.message.metadata);
        }
    }
}
