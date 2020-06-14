import { router } from "@replikit/router";
import { MessageBuilder } from "@replikit/messages";
import { AttachmentType } from "@replikit/core";

router.of("message:received").use((context, next) => {
    if (!context.message.text) {
        return next();
    }

    if (context.message.text === "тварь") {
        return context.reply("от слова тварь");
    }

    if (/(ги)(\1+и*)$/i.test(context.message.text)) {
        const message = new MessageBuilder()
            .addText("За шаги!")
            .addAttachmentByUrl(
                AttachmentType.Photo,
                "https://sntch.com/uploads/2018/07/original.jpg"
            );
        return context.reply(message);
    }

    if (context.message.text === "да") {
        const message = new MessageBuilder().addAttachmentByUrl(
            AttachmentType.Photo,
            "https://s00.yaplakal.com/pics/pics_original/7/2/9/11876927.jpg"
        );
        return context.reply(message);
    }

    if (context.message.text === "бля") {
        const message = new MessageBuilder().addAttachmentByUrl(
            AttachmentType.Photo,
            "https://i.ibb.co/Xxkpn7W/Kde90j8bpt-Y.jpg"
        );
        return context.reply(message);
    }

    return next();
});
