import { TextTokenKind, TextTokenProp } from "@replikit/core";
import {
    LinkTextToken,
    PlainTextToken,
    MentionTextToken,
    Identifier
} from "@replikit/core/typings";

export function createLinkTextToken(
    text: string,
    url: string,
    props?: TextTokenProp[]
): LinkTextToken {
    return { kind: TextTokenKind.Link, text, url, props: props ?? [] };
}

export function createPlainTextToken(text: string, props?: TextTokenProp[]): PlainTextToken {
    return { kind: TextTokenKind.Text, text, props: props ?? [] };
}

export function createMentionTextToken(
    text: string,
    username?: string,
    id?: Identifier,
    props?: TextTokenProp[]
): MentionTextToken {
    return { kind: TextTokenKind.Mention, text, username, id, props: props ?? [] };
}
