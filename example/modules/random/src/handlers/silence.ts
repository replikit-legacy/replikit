import { router } from "@replikit/router";
import { RandomLocale } from "@example/random";

let silentMode = false;

router.of("message:received").use(async (context, next) => {
    if (!silentMode) {
        return next();
    }

    const text = context.message.text?.toLowerCase();
    const locale = context.getLocale(RandomLocale);
    if (text === locale.deactivateSilentMode) {
        silentMode = false;
        await context.reply(locale.silentModeDeactivated);
        return;
    }

    if (context.channel.permissions.deleteOtherMessages) {
        await context.controller.deleteMessage(context.channel.id, context.message.metadata);
    }
});

router.of("message:received").use(async (context, next) => {
    const text = context.message.text?.toLowerCase();
    const locale = context.getLocale(RandomLocale);
    if (text === locale.keepSilence) {
        silentMode = true;
        await context.reply(locale.silentModeActivated);
    }

    return next();
});
