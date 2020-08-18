import { command } from "@replikit/commands";
import { fromCode } from "@replikit/messages";
import { config } from "@replikit/core";
import { RandomLocale } from "@example/random";
import { CommandContext, CommandResult } from "@replikit/commands/typings";

command("test")
    .handler(handler)
    .register();

function handler(context: CommandContext): CommandResult {
    const locale = context.getLocale(RandomLocale);
    const replacer = createReplacer(locale);
    const message = JSON.stringify(context.message, replacer, 2);
    return fromCode(message);
}

type Replacer = (key: string, value: unknown) => unknown;

function createReplacer(locale: RandomLocale): Replacer {
    return (key: string, value: unknown): unknown => {
        if (typeof value === "bigint") return value.toString();
        return typeof value === "string"
            ? value.replace(config.telegram.token, locale.dataDeleted)
            : value;
    };
}
