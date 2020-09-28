import {
    SessionConstructor,
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
import { SessionType, InvalidSessionTypeError, MongoSessionStorage } from "@replikit/sessions";
import { config, ModuleNotFoundError } from "@replikit/core";
import { Identifier } from "@replikit/core/typings";

function createBaseSessionKey(controller: string, ctr: SessionConstructor): string {
    return `${ctr.namespace}:${controller}:${ctr.type}`;
}

export function createSessionKey(
    controller: string,
    ctr: SessionConstructor,
    id: Identifier,
    additionalId?: Identifier
): string {
    return additionalId
        ? `${createBaseSessionKey(controller, ctr)}:${id}:${additionalId}`
        : `${createBaseSessionKey(controller, ctr)}:${id}`;
}

export async function createSessionKeyFromContext(
    context: Context,
    ctr: SessionConstructor
): Promise<string> {
    const baseKey = createBaseSessionKey(context.controller.name, ctr);
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
        case SessionType.Message: {
            if (context instanceof MessageContext) {
                return `${baseKey}:${context.channel.id}:${context.message.metadata.messageIds[0]}`;
            }
            throw new InvalidSessionTypeError(type, context);
        }
    }
}

let storage: SessionStorage;

function resolveSessionStorage(option: SessionStorageOption): SessionStorage {
    switch (option) {
        case "memory":
            return new Map();
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
