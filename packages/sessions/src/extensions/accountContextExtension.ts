import { AccountContext } from "@replikit/router";
import { Extension, config } from "@replikit/core";
import { SessionManager, SessionType, createSessionKey } from "@replikit/sessions";
import { SessionConstructor } from "@replikit/sessions/typings";

@Extension
export class AccountContextExtension extends AccountContext {
    /** @internal */
    sessionManager: SessionManager;

    private getSessionKey(type: SessionConstructor): string {
        switch (type.type) {
            case SessionType.Channel:
                return `${createSessionKey(type, this.controller.name)}_${this.channel.id}`;
            case SessionType.Account:
                return `${createSessionKey(type, this.controller.name)}_${this.account.id}`;
            case SessionType.Member: {
                const keyPrefix = createSessionKey(type, this.controller.name);
                return `${keyPrefix}_${this.channel.id}_${this.account.id}`;
            }
        }
    }

    getSession<T>(type: SessionConstructor<T>): Promise<T> {
        if (!this.sessionManager) {
            this.sessionManager = new SessionManager(config.sessions.storage);
        }
        const key = this.getSessionKey(type);
        return this.sessionManager.get(key, type);
    }
}
