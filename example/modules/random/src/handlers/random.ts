import { router } from "@replikit/router";
import { MessageBuilder, hashString } from "@replikit/messages";
import { AttachmentType } from "@replikit/core";
import { Attachment } from "@replikit/core/typings";

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface VirtualSticker {
    id: string;
    url: string;
}

const stickers: VirtualSticker[] = [
    {
        id: "CAACAgIAAxkBAAEBL_JfM58fCaaj0EX_Eey-SaYp7KtIuAACHQADmV69EN4DgzuQR9e2GgQ",
        url: "https://sntch.com/uploads/2018/07/original.jpg"
    },
    {
        id: "CAACAgIAAxkBAAEBL_dfM6EtxgPFi8QbY9mLyNEEM7e5tAACHgADmV69EJQyflgitAWAGgQ",
        url: "https://i.ibb.co/Xxkpn7W/Kde90j8bpt-Y.jpg"
    },
    {
        id: "CAACAgIAAxkBAAEBL_lfM6H1erE42SVha8kzV_jleORdJAACHwADmV69EOoGghak9BZiGgQ",
        url: "https://s00.yaplakal.com/pics/pics_original/7/2/9/11876927.jpg"
    },
    {
        id: "CAACAgIAAxkBAAEBL_pfM6H3PuUJTKTsG1l7ORRe-M5KkQACIAADmV69EED4UAGc6Y41GgQ",
        url: "https://pbs.twimg.com/media/EGhPjpqXUAA_zLk?format=jpg&name=small"
    },
    {
        id: "CAACAgIAAxkBAAEBL_xfM6H5--4EjCtZIMjsmCkLnaqwTgACIQADmV69EAXQxTJ1laKtGgQ",
        url: "https://pbs.twimg.com/media/EGkdIj-WkAA_TAd?format=jpg&name=900x900"
    }
];

router.of("message:received").use((context, next) => {
    if (!context.message.text) {
        return next();
    }

    if (context.message.text === "тварь") {
        return context.reply("от слова тварь");
    }

    function createStickerAttachment(sticker: VirtualSticker): Attachment {
        return context.controller.name === "tg"
            ? { type: AttachmentType.Sticker, controllerName: "tg", id: sticker.id }
            : { type: AttachmentType.Photo, id: hashString(sticker.url), url: sticker.url };
    }

    if (/(ги)(\1+и*)$/i.test(context.message.text)) {
        const message = new MessageBuilder()
            .addText("За шаги!")
            .addAttachment(createStickerAttachment(stickers[0]));
        return context.reply(message);
    }

    if (context.message.text === "бля") {
        const message = new MessageBuilder().addAttachment(createStickerAttachment(stickers[1]));
        return context.reply(message);
    }

    if (context.message.text.toLowerCase() === "да") {
        const lastStickers = stickers.slice(2);
        const sticker = lastStickers[getRandomInt(0, lastStickers.length - 1)];
        const attachment = createStickerAttachment(sticker);
        const message = new MessageBuilder().addAttachment(attachment);
        return context.reply(message);
    }

    return next();
});
