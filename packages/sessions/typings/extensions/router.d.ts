import "@replikit/router/typings";
import { SessionConstructor } from "@replikit/sessions/typings";

declare module "@replikit/router/typings/context/channelContext" {
    export interface ChannelContext {
        getSession<T>(type: SessionConstructor<T>): Promise<T>;
    }
}

declare module "@replikit/router/typings/context/accountContext" {
    export interface AccountContext {
        getSession<T>(type: SessionConstructor<T>): Promise<T>;
    }
}
