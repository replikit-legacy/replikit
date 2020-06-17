import { CommandBuilder, MiddlewareStage } from "@replikit/commands";
import { Extension } from "@replikit/core";
import {
    UserPermissionName,
    MemberPermissionName
} from "@replikit/permissions/typings";
import { FallbackStrategy, Channel } from "@replikit/storage";
import { ChannelParameterOptions } from "@replikit/storage/typings";

@Extension
export class CommandBuilderExtension extends CommandBuilder {
    authorizeUser(permission: UserPermissionName): this {
        return this.use(
            MiddlewareStage.BeforeResolution,
            async (context, next) => {
                const user = await context.getUser(FallbackStrategy.Undefined);
                if (!user || !user.hasPermission(permission)) {
                    await context.reply(context.t.authorization.accessDenied);
                    return;
                }
                return next();
            }
        );
    }

    channel(name?: string): this {
        const resolvedName = name ?? "channel";
        this.optional(resolvedName, Channel, { currentAsDefault: true });
        this.use(MiddlewareStage.AfterResolution, async (context, next) => {
            if (!context.params[resolvedName]) {
                const channel = await context.getChannel(
                    FallbackStrategy.Undefined
                );
                if (!channel) {
                    // TODO Expose replyParameterError from commandStorage handler and use here
                    await context.reply(context.t.storage.channelNotFound);
                    return;
                }
                context.params[resolvedName] = channel;
            }
            return next();
        });
        return this;
    }

    authorizeMember(permission: MemberPermissionName): this {
        const channelParam = this.command.params.find(
            x =>
                !x.isString &&
                x.type === Channel &&
                (x.options as ChannelParameterOptions).currentAsDefault
        );

        if (!channelParam) {
            return this.use(
                MiddlewareStage.BeforeResolution,
                async (context, next) => {
                    const member = await context.getMember(
                        FallbackStrategy.Undefined
                    );
                    if (!member || !member.hasPermission(permission)) {
                        await context.reply(
                            context.t.authorization.accessDenied
                        );
                        return;
                    }
                    return next();
                }
            );
        }

        this.use(MiddlewareStage.AfterResolution, async (context, next) => {
            const channel = context.params.channel as Channel;
            if (channel.controller === context.controller.name) {
                const member = await context.getChannelMember(channel.localId);
                if (!member || !member.hasPermission(permission)) {
                    await context.reply(context.t.authorization.accessDenied);
                    return;
                }
                return next();
            }

            const user = await context.getUser();
            const member = await user.getMember(
                channel.controller,
                channel.localId
            );
            if (!member || !member.hasPermission(permission)) {
                await context.reply(context.t.authorization.accessDenied);
                return;
            }
            return next();
        });
        return this;
    }
}
