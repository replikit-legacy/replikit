import { SessionManager, createSessionKey } from "@replikit/sessions";
import { SessionConstructor } from "@replikit/sessions/typings";
import { config, Extension } from "@replikit/core";
import { Context } from "@replikit/router";

@Extension
export class ContextExtension extends Context {
    /** @internal */
    sessionManager: SessionManager;

    async getSession<T>(type: SessionConstructor<T>): Promise<T> {
        if (!this.sessionManager) {
            this.sessionManager = new SessionManager(config.sessions.storage);
        }
        const key = await createSessionKey(this, type);
        return this.sessionManager.get(key, type);
    }
}
