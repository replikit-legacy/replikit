import "@replikit/core/typings";
import { CliConfiguration } from "@replikit/cli/typings";

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        cli?: CliConfiguration;
    }
}
