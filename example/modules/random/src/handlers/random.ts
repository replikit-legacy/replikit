import { router } from "@replikit/router";
import { MessageBuilder } from "@replikit/messages";
import { AttachmentType } from "@replikit/core";

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

    if (context.message.text.toLowerCase() === "да") {
        const urls = [
            "https://s00.yaplakal.com/pics/pics_original/7/2/9/11876927.jpg",
            "https://pbs.twimg.com/media/EGhPjpqXUAA_zLk?format=jpg&name=small",
            "https://pbs.twimg.com/media/EGkdIj-WkAA_TAd?format=jpg&name=900x900"
        ];
        const message = new MessageBuilder().addAttachmentByUrl(
            AttachmentType.Photo,
            urls[getRandomInt(0, urls.length - 1)]
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
