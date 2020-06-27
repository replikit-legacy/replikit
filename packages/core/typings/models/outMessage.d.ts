import {
    Attachment,
    TextToken,
    MessageMetadata,
    ForwardedOutMessage
} from "@replikit/core/typings";

export interface OutMessage {
    tokens: TextToken[];
    attachments: Attachment[];
    reply?: number;
    forwarded: ForwardedOutMessage[];
    metadata?: MessageMetadata;
}
