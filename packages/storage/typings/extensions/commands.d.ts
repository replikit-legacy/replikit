import "@replikit/commands/typings";
import { ChannelParameterOptions } from "@replikit/storage/typings";
import { Channel } from "@replikit/storage";

declare module "@replikit/commands/typings/parameterOptionMap" {
    export interface ParameterOptionMap {
        Channel: [Channel, ChannelParameterOptions];
    }
}
