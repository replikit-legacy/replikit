import {
    OutMessage,
    ResolvedAttachment,
    MessageMetadata
} from "@replikit/core/typings";

export interface ResolvedMessage extends OutMessage {
    text: string;
    attachments: ResolvedAttachment[];
    metadata: MessageMetadata;
}
