import { createHash } from "crypto";
import { MessageMetadata } from "@replikit/core/typings";

export function hashString(input: string): string {
    return createHash("sha1")
        .update(input)
        .digest("hex");
}

export type MetadataLike = MessageMetadata | { metadata: MessageMetadata };

export function extractMetadata(metadataLike: MetadataLike): MessageMetadata {
    return "metadata" in metadataLike ? metadataLike.metadata : metadataLike;
}
