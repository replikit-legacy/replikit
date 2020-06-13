import "@replikit/storage/typings";
import { Attachment } from "@replikit/attachments/typings";

declare module "@replikit/storage/typings/collectionMap" {
    export interface CollectionMap {
        attachments: Attachment;
    }
}
