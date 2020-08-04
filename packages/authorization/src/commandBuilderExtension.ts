import { CommandBuilder, MiddlewareStage } from "@replikit/commands";
import { Extension } from "@replikit/core";
import { FallbackStrategy, Channel } from "@replikit/storage";
import { ChannelParameterOptions } from "@replikit/storage/typings";
import { fromCode } from "@replikit/messages";
import { AuthorizationLocale } from "@replikit/authorization";
import { PermissionInstance, EntityType } from "@replikit/permissions";

@Extension
export class CommandBuilderExtension extends CommandBuilder {
    authorizeUser(permission: PermissionInstance<typeof EntityType.User>): this {
        return this.use(MiddlewareStage.BeforeResolution, async (context, next) => {
            const user = await context.getUser(FallbackStrategy.Undefined);
            if (!user || !user.hasPermission(permission)) {
                const locale = context.getLocale(AuthorizationLocale);
                await context.reply(fromCode(locale.accessDenied));
                return;
            }
            return next();
        });
    }

    authorizeMember(permission: PermissionInstance<typeof EntityType.Member>): this {
        const channelParam = this.command.params.find(
            x =>
                !x.isString &&
                x.type === Channel &&
                (x.options as ChannelParameterOptions).useInAuthorization
        );

        if (!channelParam) {
            return this.use(MiddlewareStage.BeforeResolution, async (context, next) => {
                const member = await context.getMember(FallbackStrategy.Undefined);
                if (!member || !member.hasPermission(permission)) {
                    const locale = context.getLocale(AuthorizationLocale);
                    await context.reply(fromCode(locale.accessDenied));
                    return;
                }
                return next();
            });
        }

        this.use(MiddlewareStage.AfterResolution, async (context, next) => {
            const channel = context.params[channelParam.name] as Channel;
            if (channel.controller === context.controller.name) {
                const member = await context.getChannelMember(channel.localId);
                if (!member || !member.hasPermission(permission)) {
                    const locale = context.getLocale(AuthorizationLocale);
                    await context.reply(fromCode(locale.accessDenied));
                    return;
                }
                return next();
            }

            const user = await context.getUser();
            const member = await user.getMember(channel.controller, channel.localId);
            if (!member || !member.hasPermission(permission)) {
                const locale = context.getLocale(AuthorizationLocale);
                await context.reply(fromCode(locale.accessDenied));
                return;
            }
            return next();
        });
        return this;
    }
}
