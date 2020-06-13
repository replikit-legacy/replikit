import "@replikit/core/typings";
import { VKConfiguration } from "@replikit/vk/typings";

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        vk: VKConfiguration;
    }
}
