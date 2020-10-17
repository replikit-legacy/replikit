import { Constructor } from "@replikit/core/typings";
import "@replikit/router";
import { View } from "@replikit/views";
import { ViewProps, ViewTarget } from "@replikit/views/typings";

declare module "@replikit/router/typings/context/channelContext" {
    export interface ChannelContext {
        enter<T extends View>(
            view: Constructor<T>,
            props?: ViewProps<T>,
            target?: ViewTarget
        ): Promise<void>;
    }
}
