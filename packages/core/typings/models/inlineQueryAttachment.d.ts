import { AttachmentType } from "@replikit/core";

export interface InlineQueryAttachment {
    id: string;
    type: AttachmentType;
    title?: string;
}
