import { AttachmentType } from "@replikit/core";

export interface Attachment {
    id: string;
    uploadId?: string;
    controllerName?: string;
    url?: string;
    type: AttachmentType;
}
