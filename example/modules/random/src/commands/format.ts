import { Command, text } from "@replikit/commands";
import { fromCode, MessageBuilder } from "@replikit/messages";
import { TextTokenKind, TextTokenProp } from "@replikit/core";
import { CommandResult } from "@replikit/commands/typings";

export class FormatCommand extends Command {
    name = "format";

    text = text();

    execute(): CommandResult {
        try {
            const tokens = JSON.parse(this.text);
            if (!Array.isArray(tokens)) {
                return fromCode("Array expected");
            }
            for (const [i, token] of tokens.entries()) {
                if (!isTextToken(token)) {
                    return fromCode(`Invalid token at index ${i}`);
                }
            }
            const result = this.controller.formatText(tokens);
            return new MessageBuilder().addText(result);
        } catch {
            return fromCode("Invalid json");
        }
    }
}

function isTokenKind(item: unknown): item is TextTokenKind {
    return isNaN(item as number) ? false : !!TextTokenKind[item as number];
}

function isTokenProp(item: unknown): item is TextTokenKind {
    return isNaN(item as number) ? false : !!TextTokenProp[item as number];
}

function isTextToken(item: Record<string, unknown>): boolean {
    if (!isTokenKind(item["kind"])) {
        return false;
    }

    const props = item["props"] as unknown[];
    if (!Array.isArray(props)) {
        return false;
    }

    for (const prop of props) {
        if (!isTokenProp(prop)) {
            return false;
        }
    }

    return true;
}
