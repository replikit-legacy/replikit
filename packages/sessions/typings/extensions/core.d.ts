import "@replikit/core/typings";
import { SessionsConfiguration } from "@replikit/sessions/typings";

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        sessions: SessionsConfiguration;
    }
}
