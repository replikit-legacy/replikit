import { TextTokenKind } from "@replikit/core";
import { TextTokenBase } from "@replikit/core/typings";

export interface MentionTextToken extends TextTokenBase {
    kind: TextTokenKind.Mention;
    id?: number;
    username?: string;
    text?: string;
}
