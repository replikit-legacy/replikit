import { command } from "@replikit/commands";
import { fromCode } from "@replikit/messages";

command("tokenize")
    .handler(context => {
        const message = context.message.reply ?? context.message;
        const tokens = context.controller.tokenizeText(message);
        return fromCode(JSON.stringify(tokens, undefined, 2));
    })
    .register();
