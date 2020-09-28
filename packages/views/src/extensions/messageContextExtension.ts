import { Extension } from "@replikit/core";
import { Constructor } from "@replikit/core/typings";
import { MessageContext } from "@replikit/router";
import { View, ViewNotRegisteredError, viewStorage } from "@replikit/views";
import { ViewProps } from "@replikit/views/typings";

@Extension
export class MessageContextExtension extends MessageContext {
    async enter(ctr: Constructor<View>, props?: ViewProps<View>): Promise<void> {
        const view = viewStorage.resolve(this, ctr.name, undefined, props);
        if (!view) {
            throw new ViewNotRegisteredError(ctr.name);
        }
        return view.updateWorker();
    }
}
