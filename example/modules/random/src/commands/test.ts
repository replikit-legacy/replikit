import { command } from "@replikit/commands";
import { RandomLocale } from "@example/random/typings";
import { fromCode } from "@replikit/messages";
import { config } from "@replikit/core";

type Replacer = (key: string, value: unknown) => unknown;

function createReplacer(locale: RandomLocale): Replacer {
    return (key: string, value: unknown): unknown => {
        return typeof value === "string"
            ? value.replace(config.telegram.token, locale.dataDeleted)
            : value;
    };
}

command("test")
    .handler(context => {
        const replacer = createReplacer(context.t.random);
        const message = JSON.stringify(context.message, replacer, 2);
        return fromCode(message);
    })
    .register();
