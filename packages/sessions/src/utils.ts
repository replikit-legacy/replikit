import { SessionConstructor } from "@replikit/sessions/typings";
import { Context, AccountContext, ChannelContext, MemberContext } from "@replikit/router";
import { SessionType, InvalidSessionTypeError } from "@replikit/sessions";
import { ModuleNotFoundError } from "@replikit/core";

export async function createSessionKey(context: Context, ctr: SessionConstructor): Promise<string> {
    const baseKey = `${ctr.namespace}:${context.controller.name}:${ctr.type}`;
    const type = ctr.type;
    switch (type) {
        case SessionType.Account: {
            if (context instanceof AccountContext || context instanceof MemberContext) {
                return `${baseKey}:${context.account.id}`;
            }
            throw new InvalidSessionTypeError(type, context);
        }
        case SessionType.Channel: {
            if (context instanceof ChannelContext) {
                return `${baseKey}:${context.channel.id}`;
            }
            throw new InvalidSessionTypeError(type, context);
        }
        case SessionType.Member: {
            if (context instanceof MemberContext) {
                return `${baseKey}:${context.channel.id}:${context.account.id}`;
            }
            throw new InvalidSessionTypeError(type, context);
        }
        case SessionType.User: {
            if (context instanceof AccountContext || context instanceof MemberContext) {
                try {
                    const user = await context.getUser();
                    return `${baseKey}:${user._id}`;
                } catch (e) {
                    if (e instanceof ReferenceError)
                        throw new ModuleNotFoundError("@replikit/storage", "SessionType.User");
                    throw e;
                }
            }
            throw new InvalidSessionTypeError(type, context);
        }
    }
}
