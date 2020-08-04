import {
    CommandBuilder,
    MiddlewareStage,
    AddRequired,
    Required as _Required
} from "@replikit/commands";
import {
    Channel,
    StorageLocale,
    User,
    currentChannel,
    currentUser,
    Member
} from "@replikit/storage";
import { Parameters } from "@replikit/commands/typings";
import { fromCode } from "@replikit/messages";
import { Extension } from "@replikit/core";
import { MemberOptions, ChannelOptions, UserOptions } from "@replikit/storage/typings";

const defaultMemberOptions: Required<MemberOptions> = {
    name: "member",
    channelParameterName: "channel",
    channelRequired: false,
    useChannelInAuthorization: true,
    userParameterName: "user",
    userRequired: false,
    reverse: false
};

const defaultChannelOptions: Required<ChannelOptions> = {
    name: "channel",
    required: false,
    useInAuthorization: true
};

const defaultUserOptions: Required<UserOptions> = {
    name: "user",
    required: false
};

@Extension
export class CommandBuilderExtension<C, P extends Parameters> extends CommandBuilder<C, P> {
    channel(): AddRequired<C, P, "channel", Channel>;
    channel<T extends string>(options?: ChannelOptions<T>): AddRequired<C, P, T, Channel>;
    channel(options?: ChannelOptions): unknown {
        const resolvedOptions = { ...defaultChannelOptions, ...options };
        if (resolvedOptions.required) {
            this.required(resolvedOptions.name, Channel, {
                useInAuthorization: resolvedOptions.useInAuthorization
            });
        } else {
            this.optional(resolvedOptions.name, Channel, {
                default: currentChannel,
                useInAuthorization: resolvedOptions.useInAuthorization
            });
        }
        return this;
    }

    user(): AddRequired<C, P, "user", User>;
    user<T extends string>(options?: UserOptions<T>): AddRequired<C, P, T, User>;
    user(options?: UserOptions): unknown {
        const resolvedOptions = { ...defaultUserOptions, ...options };
        if (resolvedOptions.required) {
            this.required(resolvedOptions.name, User);
        } else {
            this.optional(resolvedOptions.name, User, { default: currentUser });
        }
        return this;
    }

    member(): CommandBuilder<
        C,
        P & _Required<"member", Member> & _Required<"channel", Channel> & _Required<"user", User>
    >;
    member<T extends string, C extends string, U extends string>(
        options?: MemberOptions<T, C, U>
    ): CommandBuilder<C, P & _Required<T, Member> & _Required<C, Channel> & _Required<U, User>>;
    member(options?: MemberOptions): unknown {
        const resolvedOptions = { ...defaultMemberOptions, ...options };
        const channelOptions = {
            name: resolvedOptions.channelParameterName,
            required: resolvedOptions.channelRequired,
            useInAuthorization: resolvedOptions.useChannelInAuthorization
        };
        const userOptions = {
            name: resolvedOptions.userParameterName,
            required: resolvedOptions.userRequired
        };
        resolvedOptions.reverse
            ? this.user(userOptions).channel(channelOptions)
            : this.channel(channelOptions).user(userOptions);
        return this.use(MiddlewareStage.AfterResolution, async (context, next) => {
            const user = context.params[resolvedOptions.userParameterName] as User;
            const channel = context.params[resolvedOptions.channelParameterName] as Channel;
            const member = await user.getMember(channel.controller, channel.localId);
            if (!member) {
                const locale = context.getLocale(StorageLocale);
                return context.reply(fromCode(locale.memberNotFound));
            }
            context.params[resolvedOptions.name] = member;
            return next();
        });
    }
}
