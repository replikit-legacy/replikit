import { ModuleNotFoundError, requireOptional } from "@replikit/core";
import { HasFields } from "@replikit/core/typings";
import { Channel, Member, User } from "@replikit/storage";
import { ChannelOptions, MemberOptions, UserOptions } from "@replikit/storage/typings";

export interface MemberComposition {
    member: Member;
    user: User;
    channel: Channel;
}

type MemberParameter = (options?: MemberOptions) => MemberComposition;
type UserParameter = (options?: UserOptions) => User;
type ChannelParameter = (options?: ChannelOptions) => Channel;

export let member: MemberParameter = () => {
    throw new ModuleNotFoundError("@replikit/commands", "member parameter");
};

export let user: UserParameter = () => {
    throw new ModuleNotFoundError("@replikit/commands", "user parameter");
};

export let channel: ChannelParameter = () => {
    throw new ModuleNotFoundError("@replikit/commands", "channel parameter");
};

const commands = requireOptional<typeof import("@replikit/commands")>("@replikit/commands");

if (commands) {
    const { commandComposer, MiddlewareStage, createParameterAccessor } = commands;

    member = options => {
        return commandComposer.compose((builder, field) => {
            builder.member({ ...options, name: options?.name ?? field });
            builder.use(MiddlewareStage.AfterResolution, (context, next) => {
                const { member, user, channel } = context.params;
                ((context as unknown) as HasFields)._memberComposition = { member, user, channel };
                return next();
            });
            return {
                get: context =>
                    ((context as unknown) as HasFields)._memberComposition as MemberComposition
            };
        });
    };

    user = options => {
        return commandComposer.compose((builder, field) => {
            const name = options?.name ?? field;
            builder.user({ ...options, name });
            return { get: createParameterAccessor(field) };
        });
    };

    channel = options => {
        return commandComposer.compose((builder, field) => {
            const name = options?.name ?? field;
            builder.channel({ ...options, name });
            return { get: createParameterAccessor(field) };
        });
    };
}
