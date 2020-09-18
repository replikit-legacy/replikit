import {
    SessionManager,
    createSessionKeyFromContext,
    Session,
    resolveSessionStorage
} from "@replikit/sessions";
import { SessionConstructor } from "@replikit/sessions/typings";
import { config, Extension } from "@replikit/core";
import { Context } from "@replikit/router";

@Extension
export class ContextExtension extends Context {
    /** @internal */
    sessionManager: SessionManager;

    async getSession<T extends Session>(
        type: SessionConstructor<T>,
        customKey?: string
    ): Promise<T> {
        const key = customKey ?? (await createSessionKeyFromContext(this, type));
        if (!this.sessionManager) {
            const storage = resolveSessionStorage(config.sessions.storage);
            this.sessionManager = new SessionManager(storage);
        }
        return this.sessionManager.get(key, type);
    }
}
