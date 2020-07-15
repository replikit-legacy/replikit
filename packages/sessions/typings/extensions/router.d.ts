import "@replikit/router/typings";
import { SessionConstructor } from "@replikit/sessions/typings";
import { HasFields } from "@replikit/core/typings";

declare module "@replikit/router/typings/context/channelContext" {
    export interface ChannelContext {
        getSession<T extends HasFields>(type: SessionConstructor<T>): Promise<T>;
    }
}

declare module "@replikit/router/typings/context/accountContext" {
    export interface AccountContext {
        getSession<T extends HasFields>(type: SessionConstructor<T>): Promise<T>;
    }
}
