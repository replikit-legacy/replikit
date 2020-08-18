import "@replikit/core/typings";
import { DiscordConfiguration } from "@replikit/discord/typings";
import { DiscordController } from "@replikit/discord";

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        discord: DiscordConfiguration;
    }
}

declare module "@replikit/core/typings/controllerMap" {
    export interface ControllerMap {
        dc: DiscordController;
    }
}
