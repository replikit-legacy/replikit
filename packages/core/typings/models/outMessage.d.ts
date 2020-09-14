import {
    Attachment,
    TextToken,
    MessageMetadata,
    ForwardedOutMessage,
    MessageHeader,
    Button
} from "@replikit/core/typings";

export interface OutMessage {
    tokens: TextToken[];
    attachments: Attachment[];
    reply?: MessageMetadata;
    forwarded: ForwardedOutMessage[];
    buttons: Button[];
    metadata?: MessageMetadata;
    header?: MessageHeader;
}
