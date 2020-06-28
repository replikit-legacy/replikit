import {
    Attachment,
    TextToken,
    MessageMetadata,
    ForwardedOutMessage
} from "@replikit/core/typings";

export interface OutMessage {
    tokens: TextToken[];
    attachments: Attachment[];
    reply?: MessageMetadata;
    forwarded: ForwardedOutMessage[];
    metadata?: MessageMetadata;
}
