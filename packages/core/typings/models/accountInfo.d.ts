import { HasId, Attachment } from "@replikit/core/typings";

export interface AccountInfo extends HasId {
    username?: string;
    firstName?: string;
    lastName?: string;
    language?: string;
    avatar?: Attachment;
}
