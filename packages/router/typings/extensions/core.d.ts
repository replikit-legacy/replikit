import "@replikit/core/typings";
import { ChannelContext } from "@replikit/router";

declare module "@replikit/core/typings/hooks/hookMap" {
    export interface HookMap {
        "router:context:created": ChannelContext;
    }
}
