import "@replikit/commands/typings";
import { ChannelParameterOptions } from "@replikit/storage/typings";
import { Channel, Member, User } from "@replikit/storage";
import { Parameters } from "@replikit/commands/typings";
import { AddRequired, Required, CommandBuilder as _CommandBuilder } from "@replikit/commands";

declare module "@replikit/commands/typings/parameterOptionMap" {
    export interface ParameterOptionMap {
        Channel: [Channel, ChannelParameterOptions];
    }
}

export interface ChannelOptions<T extends string = "channel"> {
    name?: T;
    required?: boolean;
    useInAuthorization?: boolean;
}

export interface UserOptions<T extends string = "user"> {
    name?: T;
    required?: boolean;
}

export interface MemberOptions<
    T extends string = "member",
    C extends string = "channel",
    U extends string = "user"
> {
    name?: T;
    channelParameterName?: C;
    channelRequired?: boolean;
    useChannelInAuthorization?: boolean;
    userParameterName?: U;
    userRequired?: boolean;
    reverse?: boolean;
}

declare module "@replikit/commands/typings/commandBuilder" {
    export interface CommandBuilder<
        C = Record<string, unknown>,
        P extends Parameters = Record<string, unknown>
    > {
        channel(): AddRequired<C, P, "channel", Channel>;
        channel<T extends string = "channel">(
            options?: ChannelOptions<T>
        ): AddRequired<C, P, T, Channel>;
        user(): AddRequired<C, P, "user", User>;
        user<T extends string = "user">(options?: UserOptions<T>): AddRequired<C, P, T, User>;
        member(): _CommandBuilder<
            C,
            P & Required<"member", Member> & Required<"channel", Channel> & Required<"user", User>
        >;
        member<
            T extends string = "member",
            C extends string = "channel",
            U extends string = "user"
        >(
            options?: MemberOptions<T, C, U>
        ): _CommandBuilder<C, P & Required<T, Member> & Required<C, Channel> & Required<U, User>>;
    }
}
