import { command } from "@replikit/commands";

command("delete")
    .handler(async context => {
        const reply = context.message.reply;
        if (!reply) {
            return;
        }
        const permissions = context.message.channel.permissions;
        const canDeleteOthers = permissions.deleteOtherMessages;
        const canDeleteOwn = permissions.deleteMessages;
        const owns = reply.account.id === context.controller.botId;
        if (canDeleteOthers || (owns && canDeleteOwn)) {
            await context.controller.deleteMessage(
                context.channel.id,
                reply.metadata
            );
            if (canDeleteOthers) {
                await context.controller.deleteMessage(
                    context.channel.id,
                    context.message.metadata
                );
            }
        }
    })
    .register();
