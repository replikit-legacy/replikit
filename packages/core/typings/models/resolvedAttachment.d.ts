import { Attachment } from "@replikit/core/typings";

export interface ResolvedAttachment extends Attachment {
    source: string;
}
