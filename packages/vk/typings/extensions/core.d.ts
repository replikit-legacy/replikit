import "@replikit/core/typings";
import { VKConfiguration } from "@replikit/vk/typings";
import { VKController } from "@replikit/vk";

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        vk: VKConfiguration;
    }
}

declare module "@replikit/core/typings/controllerMap" {
    export interface ControllerMap {
        vk: VKController;
    }
}

declare module "@replikit/core/typings/models/messageMetadata" {
    export interface MessageMetadata {
        globalId?: number;
    }
}
