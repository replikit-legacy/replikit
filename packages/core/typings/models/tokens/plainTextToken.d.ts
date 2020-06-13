import { TextTokenBase } from "@replikit/core/typings";
import { TextTokenKind } from "@replikit/core";

export interface PlainTextToken extends TextTokenBase {
    kind: TextTokenKind.Text;
    text: string;
}
