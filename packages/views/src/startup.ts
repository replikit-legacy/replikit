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
    const view = viewStorage.resolve(context, data.view, context.message.metadata);
    if (!view) {
        return next();
    }
    await view._load();
    const actions = view._session!.actions;
    const action = actions && actions[data.action];
    if (!action) {
        return next();
    }
    await view._invoke(action.name, ...action.arguments);
});
