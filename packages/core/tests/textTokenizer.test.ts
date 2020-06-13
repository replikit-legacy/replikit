import { TextTokenizer, TextTokenKind, TextTokenProp } from "@replikit/core";

const tokenizer = new TextTokenizer()
    .addTextPropRule("**", TextTokenProp.Bold)
    .addTextPropRule("*", TextTokenProp.Italic)
    .addTextPropRule("__", TextTokenProp.Underline)
    .addTextPropRule("~~", TextTokenProp.Strikethrough)
    .addTextPropRule("```", TextTokenProp.Monospace)
    .addRegexRule(/<!?@(\d*)>/, groups => ({
        kind: TextTokenKind.Mention as const,
        id: +groups[1],
        props: []
    }));

describe("textTokenizer", () => {
    it("should tokenize a text with props", () => {
        const text = "**test** __test__ *test*";
        const tokens = tokenizer.tokenize(text);

        expect(tokens).toMatchSnapshot();
    });

    it("should tokenize a text with mentions and props", () => {
        const text = "<!@88005553535> __***test*** ~~test~~__ <@999>";
        const tokens = tokenizer.tokenize(text);

        expect(tokens).toMatchSnapshot();
    });

    it("should tokenize a text with multiline code", () => {
        const text = "test ```\ntest\n```";
        const tokens = tokenizer.tokenize(text);

        expect(tokens).toMatchSnapshot();
    });
});
