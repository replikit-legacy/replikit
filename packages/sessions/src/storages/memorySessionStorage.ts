import { HasFields } from "@replikit/core/typings";
import { serializeSessionKey } from "@replikit/sessions";
import { SessionKey, SessionStorage } from "@replikit/sessions/typings";

export class MemorySessionStorage implements SessionStorage {
    /** @internal */
    readonly _sessionMap = new Map<string, HasFields>();

    set(key: SessionKey, value: Record<string, unknown>): void {
        this._sessionMap.set(serializeSessionKey(key), value);
    }

    delete(key: SessionKey): void {
        this._sessionMap.delete(serializeSessionKey(key));
    }

    get(key: SessionKey): HasFields | undefined {
        return this._sessionMap.get(serializeSessionKey(key));
    }

    find(): never {
        // TODO find queries in memory storage
        throw new Error("Unable to perform find query when using memory storage");
    }
}
