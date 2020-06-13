import { router } from "@replikit/router";
import { MessageBuilder } from "@replikit/messages";

router.of("message:edited").use(context => {
    context.reply(context.t.random.userEditedMessage(context.account));
});

router.of("account:left").use(context => {
    context.reply(context.t.random.accountLeft(context.account));
});

router.of("account:joined").use(context => {
    context.reply(context.t.random.accountJoined(context.account));
});

router.of("channel:title:edited").use(context => {
    context.reply(context.t.random.channelTitleEdited(context.channel));
});

router.of("channel:photo:edited").use(context => {
    const message = new MessageBuilder()
        .addText(context.t.random.channelPhotoEdited)
        .addAttachment(context.event.payload.photo)
        .build();
    context.reply(message);
});

router.of("channel:photo:deleted").use(context => {
    context.reply(context.t.random.channelPhotoDeleted);
});
