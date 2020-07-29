import { CommandBuilder, MiddlewareStage } from "@replikit/commands";
import { Channel, FallbackStrategy, StorageLocale } from "@replikit/storage";
import { fromCode } from "@replikit/messages";
import { Extension } from "@replikit/core";

@Extension
export class CommandBuilderExtension extends CommandBuilder {
    channel(name?: string): never {
        const resolvedName = name ?? "channel";
        this.optional(resolvedName, Channel, { currentAsDefault: true });
        this.use(MiddlewareStage.AfterResolution, async (context, next) => {
            if (!context.params[resolvedName]) {
                const channel = await context.getChannel(FallbackStrategy.Undefined);
                if (!channel) {
                    // TODO Expose replyParameterError from commandStorage handler and use here
                    const locale = context.getLocale(StorageLocale);
                    await context.reply(fromCode(locale.channelNotFound));
                    return;
                }
                context.params[resolvedName] = channel;
            }
            return next();
        });
        return this as never;
    }
}
