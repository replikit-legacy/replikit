import { createHash } from "crypto";

export function hashString(input: string): string {
    return createHash("sha1")
        .update(input)
        .digest("hex");
}
