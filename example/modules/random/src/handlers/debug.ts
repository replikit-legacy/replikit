import { router } from "@replikit/router";
import { MessageBuilder } from "@replikit/messages";
import { RandomLocale } from "@example/random";

router.of("message:edited").use(async context => {
    const locale = context.getLocale(RandomLocale);
    await context.reply(locale.userEditedMessage(context.account));
});

router.of("member:left").use(async context => {
    const locale = context.getLocale(RandomLocale);
    await context.reply(locale.accountLeft(context.account));
});

router.of("member:joined").use(async context => {
    const locale = context.getLocale(RandomLocale);
    await context.reply(locale.accountJoined(context.account));
});

router.of("channel:title:edited").use(async context => {
    const locale = context.getLocale(RandomLocale);
    await context.reply(locale.channelTitleEdited(context.channel));
});

router.of("channel:photo:edited").use(async context => {
    const locale = context.getLocale(RandomLocale);
    const message = new MessageBuilder()
        .addText(locale.channelPhotoEdited)
        .addAttachment(context.event.payload.photo)
        .build();
    await context.reply(message);
});

router.of("channel:photo:deleted").use(async context => {
    const locale = context.getLocale(RandomLocale);
    await context.reply(locale.channelPhotoDeleted);
});
