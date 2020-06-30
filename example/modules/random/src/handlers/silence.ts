import { router } from "@replikit/router";

let silentMode = false;

router.of("message:received").use(async (context, next) => {
    if (!silentMode) {
        return next();
    }

    const text = context.message.text?.toLowerCase();
    if (text === context.t.random.deactivateSilentMode) {
        silentMode = false;
        await context.reply(context.t.random.silentModeDeactivated);
    }

    if (context.channel.permissions.deleteOtherMessages) {
        await context.controller.deleteMessage(context.channel.id, context.message.metadata);
    }
});

router.of("message:received").use(async (context, next) => {
    const text = context.message.text?.toLowerCase();
    if (text === context.t.random.keepSilence) {
        silentMode = true;
        await context.reply(context.t.random.silentModeActivated);
    }

    return next();
});
