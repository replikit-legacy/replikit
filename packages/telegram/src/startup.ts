import { hook, registerController, createScope } from "@replikit/core";
import { TelegramController } from "@replikit/telegram";

/** @internal */
export const logger = createScope("telegram");

hook("core:startup:init", () => {
    registerController(new TelegramController());
});
