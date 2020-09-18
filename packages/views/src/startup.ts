import { createScope } from "@replikit/core";
import { router } from "@replikit/router";
import { isViewPayload, parseJSON, viewStorage } from "@replikit/views";

/** @internal */
export const logger = createScope("views");

router.of("button:clicked").use(async (context, next) => {
    if (!context.buttonPayload) {
        return next();
    }
    const data = parseJSON(context.buttonPayload);
    if (!data || !isViewPayload(data)) {
        return next();
    }
    const view = viewStorage.resolve(
        context,
        data.view,
        context.channel.id,
        context.message.metadata
    );
    if (!view || !(data.action in view)) {
        return next();
    }
    await view.syncFields();
    if (!view.session?.actions?.includes(data.action)) {
        return next();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (view as any)[data.action]();
});
