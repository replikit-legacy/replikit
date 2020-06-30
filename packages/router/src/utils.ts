import { OutMessage } from "@replikit/core/typings";
import { MessageBuilder, fromText } from "@replikit/messages";

export function resolveMessage(message: OutMessage | MessageBuilder | string): OutMessage {
    if (typeof message === "string") {
        return fromText(message);
    }
    if (message instanceof MessageBuilder) {
        return message.build();
    }
    return message;
}
