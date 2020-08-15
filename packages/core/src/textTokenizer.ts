import { TextTokenKind, TextTokenProp } from "@replikit/core";
import { TextToken, PlainTextToken } from "@replikit/core/typings";

type TokenizerHandler = (groups: string[]) => TextToken;

interface HandlerTokenizerRule {
    pattern: RegExp;
    handler: TokenizerHandler;
}

interface TextPropTokenizerRule {
    pattern: string;
    prop: TextTokenProp;
}

function matchAll(str: string, regexp: RegExp): RegExpExecArray[] {
    const flags = regexp.global ? regexp.flags : regexp.flags + "g";
    const re = new RegExp(regexp, flags);
    const matches: RegExpExecArray[] = [];
    let match: RegExpExecArray | null;
    while ((match = re.exec(str))) {
        matches.push(match);
    }
    return matches;
}

export class TextTokenizer {
    private readonly handlerRules: HandlerTokenizerRule[] = [];
    private readonly textPropRules: TextPropTokenizerRule[] = [];

    addRegexRule(pattern: RegExp, handler: TokenizerHandler): this {
        this.handlerRules.push({ pattern, handler });
        return this;
    }

    addTextPropRule(pattern: string, prop: TextTokenProp): this {
        this.textPropRules.push({ pattern, prop });
        return this;
    }

    private matchTextPropRules(text: string): PlainTextToken[] {
        const tokens: PlainTextToken[] = [];
        const props: TextTokenProp[] = [];
        const chars = text.split("");

        let buf = "";
        for (const [i, c] of chars.entries()) {
            buf += c;

            if (c !== chars[i - 1] && c === chars[i + 1]) {
                continue;
            }

            const rule = this.textPropRules.find(x => buf.endsWith(x.pattern));
            if (!rule) {
                continue;
            }

            const text = buf.replace(rule.pattern, "");
            if (text) {
                tokens.push({
                    kind: TextTokenKind.Text,
                    text,
                    props: [...props]
                });
            }

            if (props.includes(rule.prop)) {
                props.splice(props.indexOf(rule.prop), 1);
            } else {
                props.push(rule.prop);
            }

            buf = "";
        }

        if (buf) {
            tokens.push({
                kind: TextTokenKind.Text,
                text: buf,
                props: []
            });
        }

        return tokens;
    }

    tokenize(text: string | undefined): TextToken[] {
        if (!text) {
            return [];
        }
        const tokens: TextToken[] = [];
        const matches = this.handlerRules
            .flatMap(rule => {
                const matches = matchAll(text, rule.pattern);
                return matches.map(match => ({ rule, match }));
            })
            .sort((a, b) => a.match.index - b.match.index);

        if (!matches.length) {
            return this.matchTextPropRules(text);
        }

        let lastIndex = 0;
        for (const match of matches) {
            const plainText = text.slice(lastIndex, match.match.index);
            if (plainText) {
                tokens.push(...this.matchTextPropRules(plainText));
            }
            tokens.push(match.rule.handler(match.match));
            lastIndex = match.match.index + match.match[0].length;
        }

        if (text.length > lastIndex) {
            const plainText = text.slice(lastIndex, text.length);
            if (plainText) {
                tokens.push(...this.matchTextPropRules(plainText));
            }
        }

        return tokens;
    }
}
