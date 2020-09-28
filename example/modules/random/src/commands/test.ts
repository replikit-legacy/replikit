import { Command } from "@replikit/commands";
import { fromCode } from "@replikit/messages";
import { config } from "@replikit/core";
import { RandomLocale } from "@example/random";
import { CommandResult } from "@replikit/commands/typings";

export class TestCommand extends Command {
    name = "test";

    execute(): CommandResult {
        const locale = this.getLocale(RandomLocale);
        const replacer = createReplacer(locale);
        const message = JSON.stringify(this.message, replacer, 2);
        return fromCode(message);
    }
}

type Replacer = (key: string, value: unknown) => unknown;

function createReplacer(locale: RandomLocale): Replacer {
    return (_, value: unknown): unknown => {
        return typeof value === "string"
            ? value.replace(config.telegram.token, locale.dataDeleted)
            : value;
    };
}
