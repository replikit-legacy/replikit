import { SendedAttachment, MessageMetadata } from "@replikit/core/typings";

export interface SendedMessage {
    id: number;
    attachments: SendedAttachment[];
    metadata: MessageMetadata;
}
