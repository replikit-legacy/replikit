import { SendedAttachment, MessageMetadata } from "@replikit/core/typings";

export interface SendedMessage {
    attachments: SendedAttachment[];
    metadata: MessageMetadata;
}
