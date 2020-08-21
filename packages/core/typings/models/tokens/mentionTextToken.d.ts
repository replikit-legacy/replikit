import { TextTokenKind } from "@replikit/core";
import { TextTokenBase, Identifier } from "@replikit/core/typings";

export interface MentionTextToken extends TextTokenBase {
    kind: TextTokenKind.Mention;
    id?: Identifier;
    username?: string;
    text?: string;
}
