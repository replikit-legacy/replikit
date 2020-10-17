import "@replikit/router/typings";
import { Session } from "@replikit/sessions";
import { SessionConstructor, SessionKey } from "@replikit/sessions/typings";

declare module "@replikit/router/typings/context/context" {
    export interface Context {
        getSession<T extends Session>(type: SessionConstructor<T>, key?: SessionKey): Promise<T>;

        findSession<T extends Session>(
            type: SessionConstructor<T>,
            filter?: Partial<SessionKey>
        ): Promise<T | undefined>;
    }
}
