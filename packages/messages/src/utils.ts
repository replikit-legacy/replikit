import { createHash } from "crypto";
import { MessageMetadata, OutMessage } from "@replikit/core/typings";
import { OutMessageLike } from "@replikit/messages/typings";
import { fromText, MessageBuilder } from "@replikit/messages";

export function hashString(input: string): string {
    return createHash("sha1")
        .update(input)
        .digest("hex");
}

export type MetadataLike = MessageMetadata | { metadata: MessageMetadata };

export function extractMetadata(metadataLike: MetadataLike): MessageMetadata {
    return "metadata" in metadataLike ? metadataLike.metadata : metadataLike;
}

export function resolveOutMessage(outMessageLike: OutMessageLike): OutMessage {
    return typeof outMessageLike === "string"
        ? fromText(outMessageLike)
        : outMessageLike instanceof MessageBuilder
        ? outMessageLike.build()
        : outMessageLike;
}
