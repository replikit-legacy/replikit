import { ResolvedAttachment } from "@replikit/core/typings";

export interface SendedAttachment {
    id: string;
    uploadId?: string;
    origin: ResolvedAttachment;
}
