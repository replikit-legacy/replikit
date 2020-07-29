import "@replikit/commands/typings";
import { ChannelParameterOptions } from "@replikit/storage/typings";
import { Channel } from "@replikit/storage";
import { Parameters } from "@replikit/commands/typings";
import { AddRequired } from "@replikit/commands";

declare module "@replikit/commands/typings/parameterOptionMap" {
    export interface ParameterOptionMap {
        Channel: [Channel, ChannelParameterOptions];
    }
}

declare module "@replikit/commands/typings/commandBuilder" {
    export interface CommandBuilder<
        C = Record<string, unknown>,
        P extends Parameters = Record<string, unknown>
    > {
        channel(): AddRequired<C, P, "channel", Channel>;
        channel<T extends string>(name: T): AddRequired<C, P, T, Channel>;
    }
}
