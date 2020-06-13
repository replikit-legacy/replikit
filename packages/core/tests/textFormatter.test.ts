import { TextFormatter, TextTokenKind, TextTokenProp } from "@replikit/core";
import { TextToken } from "@replikit/core/typings";

const formatter = new TextFormatter()
    .addVisitor(TextTokenKind.Mention, tokens => {
        return `[id${tokens.id}|${tokens.text ?? tokens.username}]`;
    })
    .addPropFormatter(TextTokenProp.Bold, "**")
    .addPropFormatter(TextTokenProp.Underline, "<u>", "</u>");

describe("TextFormatter", () => {
    it("should convert array of tokens to text", () => {
        const text: TextToken[] = [
            {
                kind: TextTokenKind.Text,
                text: "bold",
                props: [TextTokenProp.Bold]
            },
            { kind: TextTokenKind.Text, text: " ", props: [] },
            { kind: TextTokenKind.Mention, text: "text", id: 1, props: [] },
            {
                kind: TextTokenKind.Mention,
                username: "username",
                id: 2,
                props: [TextTokenProp.Underline]
            }
        ];

        const result = formatter.formatText(text);
        expect(result).toMatchSnapshot();
    });
});
