import { OutMessage } from "@replikit/core/typings";
import { TextTokenKind, TextTokenProp } from "@replikit/core";

export function fromText(text: string): OutMessage {
    return {
        tokens: [{ kind: TextTokenKind.Text, text, props: [] }],
        attachments: [],
        forwarded: []
    };
}

export function fromCode(code: string): OutMessage {
    return {
        tokens: [
            {
                kind: TextTokenKind.Text,
                text: code,
                props: [TextTokenProp.Code]
            }
        ],
        attachments: [],
        forwarded: []
    };
}
