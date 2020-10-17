import {
    SessionManager,
    createSessionKeyFromContext,
    Session,
    getSessionStorage
} from "@replikit/sessions";
import { SessionConstructor, SessionKey } from "@replikit/sessions/typings";
import { Extension } from "@replikit/core";
import { AccountContext, ChannelContext, Context } from "@replikit/router";

@Extension
export class ContextExtension extends Context {
    /** @internal */
    sessionManager: SessionManager;

    async getSession<T extends Session>(
        type: SessionConstructor<T>,
        customKey?: SessionKey
    ): Promise<T> {
        const key = customKey ?? (await createSessionKeyFromContext(this, type));
        if (!this.sessionManager) {
            const storage = getSessionStorage();
            this.sessionManager = new SessionManager(storage);
        }
        return this.sessionManager.get(key, type);
    }

    async findSession<T extends Session>(
        type: SessionConstructor<T>,
        filter: Partial<SessionKey> = {}
    ): Promise<T | undefined> {
        if (!this.sessionManager) {
            const storage = getSessionStorage();
            this.sessionManager = new SessionManager(storage);
        }
        filter.controller ??= this.controller.name;
        if (!filter.channelId && this instanceof ChannelContext) {
            filter.channelId = this.channel.id;
        }
        if (!filter.accountId && this instanceof AccountContext) {
            filter.accountId = this.account.id;
        }
        return this.sessionManager.find(filter, type);
    }
}
