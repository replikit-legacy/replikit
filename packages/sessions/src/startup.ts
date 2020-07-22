import { hook } from "@replikit/core";
import { router } from "@replikit/router";
import { ChannelContextExtension } from "@replikit/sessions";

hook("core:startup:done", () => {
    router.final.use(async (context, next) => {
        const sessionManager = (context as ChannelContextExtension).sessionManager;
        await sessionManager?.save();
        return next();
    });
});
