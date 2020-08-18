import "@replikit/core/typings";
import { RandomConfiguration } from "@example/random/typings";

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        random?: RandomConfiguration;
    }
}
