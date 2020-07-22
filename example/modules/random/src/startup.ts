import { createScope, hook, resolveController } from "@replikit/core";

/** @internal */
export const logger = createScope("random");

hook("core:startup:ready", () => {
    const { bot } = resolveController("tg");
    bot.on("text", context => {
        console.log(context);
    });
});
