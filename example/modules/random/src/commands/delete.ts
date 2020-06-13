import { command } from "@replikit/commands";

command("delete")
    .handler(async context => {
        const reply = context.message.reply;
        if (!reply) {
            return;
        }
        const canDeleteOthers =
            context.message.channel.permissions.deleteOtherMessages;
        const canDeleteOwn = context.message.channel.permissions.deleteMessages;
        const isOwn = reply.account.id === context.controller.botId;
        if (canDeleteOthers || (isOwn && canDeleteOwn)) {
            await context.controller.deleteMessage(
                context.channel.id,
                reply.id
            );
            if (canDeleteOthers) {
                await context.controller.deleteMessage(
                    context.channel.id,
                    context.message.id
                );
            }
        }
    })
    .register();
