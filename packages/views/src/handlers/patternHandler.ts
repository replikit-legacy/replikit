import { router } from "@replikit/router";
import { checkViewTarget, viewStorage } from "@replikit/views";

router.of("message:received").use(async (context, next) => {
    if (context.controller.features.inlineButtons) {
        return next();
    }
    const result = viewStorage.resolveByPattern(context);
    if (!result) {
        return next();
    }
    const [view, method] = result;
    const loaded = await view._load();
    if (!loaded) {
        return next();
    }
    if (view.authenticate && !checkViewTarget(context, view.target)) {
        return next();
    }
    const actions = view._session!.actions;
    if (!actions || !actions.some(x => x.name === method)) {
        return next();
    }
    await view._invoke(method);
});
