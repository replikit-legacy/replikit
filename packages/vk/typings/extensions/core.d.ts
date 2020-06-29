import "@replikit/core/typings";
import { VKConfiguration } from "@replikit/vk/typings";

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        vk: VKConfiguration;
    }
}

declare module "@replikit/core/typings/models/messageMetadata" {
    export interface MessageMetadata {
        globalId?: number;
    }
}
