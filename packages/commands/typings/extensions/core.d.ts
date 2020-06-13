import "@replikit/core/typings";
import { CommandsConfiguration } from "@replikit/commands/typings";

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        commands?: CommandsConfiguration;
    }
}
