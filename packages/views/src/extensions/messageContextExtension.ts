import { Extension } from "@replikit/core";
import { Constructor } from "@replikit/core/typings";
import { MessageContext } from "@replikit/router";
import { View, ViewNotRegisteredError, viewStorage } from "@replikit/views";
import { ViewProps, ViewTarget } from "@replikit/views/typings";

@Extension
export class MessageContextExtension extends MessageContext {
    async enter(
        ctr: Constructor<View>,
        props?: ViewProps<View>,
        target?: ViewTarget
    ): Promise<void> {
        const view = viewStorage.resolve(this, ctr.name, undefined, props, target);
        if (!view) {
            throw new ViewNotRegisteredError(ctr.name);
        }
        view.created && view.created();
        view.loaded && (await view.loaded());
        await view.updateWorker();
    }
}
