import {
    SessionConstructor,
    SessionKey,
    SessionStorage,
    SessionStorageOption
} from "@replikit/sessions/typings";
import {
    Context,
    AccountContext,
    ChannelContext,
    MemberContext,
    MessageContext
} from "@replikit/router";
import {
    SessionType,
    InvalidSessionTypeError,
    MongoSessionStorage,
    MemorySessionStorage
} from "@replikit/sessions";
import { config, ModuleNotFoundError } from "@replikit/core";

export function serializeSessionKey(key: SessionKey): string {
    return Object.values(key).join(":");
}

export async function createSessionKeyFromContext(
    context: Context,
    ctr: SessionConstructor
): Promise<SessionKey> {
    const result: SessionKey = {
        namespace: ctr.namespace,
        controller: context.controller.name,
        type: ctr.type
    };
    const type = ctr.type;
    switch (type) {
        case SessionType.Account: {
            if (context instanceof AccountContext || context instanceof MemberContext) {
                result.accountId = context.account.id;
                return result;
            }
            throw new InvalidSessionTypeError(type, context);
        }
        case SessionType.Channel: {
            if (context instanceof ChannelContext) {
                result.channelId = context.channel.id;
                return result;
            }
            throw new InvalidSessionTypeError(type, context);
        }
        case SessionType.Member: {
            if (context instanceof MemberContext) {
                result.channelId = context.channel.id;
                result.accountId = context.account.id;
                return result;
            }
            throw new InvalidSessionTypeError(type, context);
        }
        case SessionType.User: {
            if (context instanceof AccountContext || context instanceof MemberContext) {
                try {
                    const user = await context.getUser();
                    result.userId = user._id;
                    return result;
                } catch (e) {
                    if (e instanceof ReferenceError)
                        throw new ModuleNotFoundError("@replikit/storage", "SessionType.User");
                    throw e;
                }
            }
            throw new InvalidSessionTypeError(type, context);
        }
        case SessionType.Message: {
            if (context instanceof MessageContext) {
                result.channelId = context.channel.id;
                result.messageId = context.message.metadata.messageIds[0];
                return result;
            }
            throw new InvalidSessionTypeError(type, context);
        }
    }
}

let storage: SessionStorage;

function resolveSessionStorage(option: SessionStorageOption): SessionStorage {
    switch (option) {
        case "memory":
            return new MemorySessionStorage();
        case "database":
            return new MongoSessionStorage();
        default:
            return option;
    }
}

export function getSessionStorage(): SessionStorage {
    if (storage) {
        return storage;
    }
    return (storage = resolveSessionStorage(config.sessions.storage));
}
