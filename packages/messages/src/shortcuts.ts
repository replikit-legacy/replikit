import { OutMessage, Attachment } from "@replikit/core/typings";
import { TextTokenProp } from "@replikit/core";
import { createPlainTextToken } from "@replikit/messages";

export function fromPartial(outMessage: Partial<OutMessage>): OutMessage {
    return { attachments: [], forwarded: [], tokens: [], buttons: [], ...outMessage };
}

export function fromText(text: string): OutMessage {
    return fromPartial({ tokens: [createPlainTextToken(text)] });
}

export function fromCode(code: string): OutMessage {
    return fromPartial({ tokens: [createPlainTextToken(code, [TextTokenProp.Code])] });
}

export function fromAttachment(attachment: Attachment): OutMessage {
    return fromPartial({ attachments: [attachment] });
}
