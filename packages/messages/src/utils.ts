import { createHash } from "crypto";
import { OutMessage } from "@replikit/core/typings";
import { MessageBuilder } from "@replikit/messages";

export type MessageLike = OutMessage | MessageBuilder | void;

export function hashString(input: string): string {
    return createHash("sha1")
        .update(input)
        .digest("hex");
}
