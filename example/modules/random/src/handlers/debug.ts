import { router } from "@replikit/router";
import { MessageBuilder, fromCode } from "@replikit/messages";
import { RandomLocale } from "@example/random";
import { AttachmentType } from "@replikit/core/src";

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

router.of("inline-query:received").use(async context => {
    const attachment = {
        id: "BQADBAADPQIAAl9XmQAB9MwJWKLJogYC",
        type: AttachmentType.Sticker
    };
    await context.answer({
        results: [
            { id: "attachment", attachment, message: { text: "жъжъь" } },
            { id: "text", article: { title: "тест" } },
            { id: "text1", article: { title: "тест 2", description: "а" } }
        ],
        cacheTime: 0
    });
});

router.of("inline-query:chosen").use(async context => {
    await context.controller.sendMessage(
        context.account.id,
        fromCode(JSON.stringify(context.result, undefined, 2))
    );
});
