import "@replikit/core/typings";
import { HelpConfiguration } from "@replikit/help/typings";

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        help?: HelpConfiguration;
    }
}
