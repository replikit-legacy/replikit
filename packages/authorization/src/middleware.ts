import { AuthorizationLocale } from "@replikit/authorization";
import { createMiddleware, MiddlewareResolver, MiddlewareStage } from "@replikit/commands";
import { Middleware } from "@replikit/commands/typings";
import { fromCode } from "@replikit/messages";
import { MemberPermission, UserPermission } from "@replikit/permissions";
import { Channel, FallbackStrategy } from "@replikit/storage";
import { ChannelParameterOptions } from "@replikit/storage/typings";

export function authorizeUser(permission: UserPermission): Middleware {
    return createMiddleware(MiddlewareStage.BeforeResolution, async (context, next) => {
        const user = await context.getUser(FallbackStrategy.Undefined);
        if (!user || !user.hasPermission(permission)) {
            const locale = context.getLocale(AuthorizationLocale);
            return context.reply(fromCode(locale.accessDenied));
        }
        return next();
    });
}

export function authorizeMember(permission: MemberPermission): MiddlewareResolver {
    return builder => {
        const channelParam = builder.command.params.find(
            x =>
                !x.isString &&
                x.type === Channel &&
                (x.options as ChannelParameterOptions).useInAuthorization
        );

        if (!channelParam) {
            return createMiddleware(MiddlewareStage.BeforeResolution, async (context, next) => {
                const member = await context.getMember(FallbackStrategy.Undefined);
                if (!member || !member.hasPermission(permission)) {
                    const locale = context.getLocale(AuthorizationLocale);
                    return context.reply(fromCode(locale.accessDenied));
                }
                return next();
            });
        }

        return createMiddleware(MiddlewareStage.AfterResolution, async (context, next) => {
            const channel = context.params[channelParam.name] as Channel;
            if (channel.controller === context.controller.name) {
                const member = await context.getChannelMember(channel.localId);
                if (!member || !member.hasPermission(permission)) {
                    const locale = context.getLocale(AuthorizationLocale);
                    return context.reply(fromCode(locale.accessDenied));
                }
                return next();
            }

            const user = await context.getUser(FallbackStrategy.Undefined);
            if (!user) {
                const locale = context.getLocale(AuthorizationLocale);
                return context.reply(fromCode(locale.accessDenied));
            }
            const member = await user.getMember(channel.controller, channel.localId);
            if (!member || !member.hasPermission(permission)) {
                const locale = context.getLocale(AuthorizationLocale);
                return context.reply(fromCode(locale.accessDenied));
            }
            return next();
        });
    };
}
