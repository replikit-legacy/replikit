import {
    Attachment,
    InMessage,
    TextToken,
    MessageMetadata,
    ForwardedMessage
} from "@replikit/core/typings";

export interface OutMessage {
    tokens: TextToken[];
    attachments: Attachment[];
    reply?: InMessage;
    forwarded: ForwardedMessage[];
    metadata?: MessageMetadata;
}
