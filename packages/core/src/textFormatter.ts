import {
    TextTokenKind,
    TextTokenProp,
    TextTokenVisitorNotFoundError
} from "@replikit/core";
import { TextToken, DiscriminateUnion } from "@replikit/core/typings";

type TokenVisitorHandler<T extends TextToken = TextToken> = (
    token: T
) => string;

interface PropFormatter {
    openingText: string;
    closingText?: string;
}

export class TextFormatter {
    private readonly tokenVisitorMap = new Map<
        TextTokenKind,
        TokenVisitorHandler
    >();
    private readonly propFormatterMap = new Map<TextTokenProp, PropFormatter>();

    addVisitor<
        V extends TextTokenKind,
        T extends DiscriminateUnion<TextToken, "kind", V>
    >(kind: V, handler: TokenVisitorHandler<T>): this {
        this.tokenVisitorMap.set(
            kind,
            handler as TokenVisitorHandler<TextToken>
        );
        return this;
    }

    addPropFormatter(
        prop: TextTokenProp,
        openingText: string,
        closingText?: string
    ): this {
        this.propFormatterMap.set(prop, { openingText, closingText });
        return this;
    }

    private applyPropFormatters(content: string, token: TextToken): string {
        for (const prop of token.props) {
            const formatter = this.propFormatterMap.get(prop);
            if (!formatter) {
                continue;
            }
            content = formatter.openingText + content;
            content += formatter.closingText ?? formatter.openingText;
        }
        return content;
    }

    formatText(tokens: TextToken[]): string {
        let result = "";
        for (const token of tokens) {
            const visitor = this.tokenVisitorMap.get(token.kind);
            if (!visitor) {
                if (token.kind === TextTokenKind.Text) {
                    result += this.applyPropFormatters(token.text, token);
                    continue;
                }
                throw new TextTokenVisitorNotFoundError(token.kind);
            }
            const content = visitor(token);
            result += this.applyPropFormatters(content, token);
        }
        return result;
    }
}
