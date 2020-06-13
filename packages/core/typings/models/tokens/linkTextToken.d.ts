import { TextTokenBase } from "@replikit/core/typings";
import { TextTokenKind } from "@replikit/core";

export interface LinkTextToken extends TextTokenBase {
    kind: TextTokenKind.Link;
    url: string;
    text: string;
}
