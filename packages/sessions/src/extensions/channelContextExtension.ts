import { ChannelContext } from "@replikit/router";
import { Extension, config } from "@replikit/core";
import {
    SessionManager,
    SessionType,
    InvalidSessionTypeError,
    createSessionKey
} from "@replikit/sessions";
import { SessionConstructor } from "@replikit/sessions/typings";

@Extension
export class ChannelContextExtension extends ChannelContext {
    /** @internal */
    sessionManager: SessionManager;

    getSession<T>(type: SessionConstructor<T>): Promise<T> {
        if (!this.sessionManager) {
            this.sessionManager = new SessionManager(config.sessions.storage);
        }
        if (type.type !== SessionType.Channel) {
            throw new InvalidSessionTypeError(type.type);
        }
        const key = `${createSessionKey(type, this.controller.name)}_${this.channel.id}`;
        return this.sessionManager.get(key, type);
    }
}
