import { hook } from "@replikit/core";
import { router } from "@replikit/router";
import { ContextExtension } from "@replikit/sessions";

hook("core:startup:done", () => {
    router.final.use(async (context, next) => {
        const sessionManager = ((context as unknown) as ContextExtension).sessionManager;
        await sessionManager?.save();
        return next();
    });
});
