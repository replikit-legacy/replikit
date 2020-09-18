import "@replikit/router/typings";
import { Session } from "@replikit/sessions";
import { SessionConstructor } from "@replikit/sessions/typings";

declare module "@replikit/router/typings/context/context" {
    export interface Context {
        getSession<T extends Session>(type: SessionConstructor<T>, key?: string): Promise<T>;
    }
}
