import { router } from "@replikit/router";
import { MessageBuilder } from "@replikit/messages";

router.of("button:clicked").use(context => {
    const text = `User "${context.account.username}" clicked the button with payload "${context.buttonPayload}" in channel "${context.channel.title}"`;
    const message = new MessageBuilder().addCode(text).addReply(context.message);
    return context.reply(message);
});
