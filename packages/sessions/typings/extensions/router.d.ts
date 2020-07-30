import "@replikit/router/typings";
import { SessionConstructor } from "@replikit/sessions/typings";

declare module "@replikit/router/typings/context/context" {
    export interface Context {
        getSession<T>(type: SessionConstructor<T>): Promise<T>;
    }
}
