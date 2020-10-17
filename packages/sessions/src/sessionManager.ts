import { Constructor, HasFields } from "@replikit/core/typings";
import { serializeSessionKey, Session } from "@replikit/sessions";
import { SessionConstructor, SessionKey, SessionStorage } from "@replikit/sessions/typings";
import { classToPlain, plainToClass } from "class-transformer";

interface StoredSession {
    key: SessionKey;
    original: string;
    current: HasFields;
}

export class SessionManager {
    private sessionMap = new Map<string, StoredSession>();

    constructor(private readonly storage: SessionStorage) {}

    private async saveWorker(key: SessionKey, session: StoredSession): Promise<void> {
        if (JSON.stringify(classToPlain(session.current)) !== session.original) {
            await this.storage.set(key, classToPlain(session.current));
        }
    }

    async saveSession(key: SessionKey): Promise<void> {
        const session = this.sessionMap.get(serializeSessionKey(key));
        return session && this.saveWorker(key, session);
    }

    async save(): Promise<void> {
        for (const session of this.sessionMap.values()) {
            await this.saveWorker(session.key, session);
        }
    }

    async delete(key: SessionKey): Promise<void> {
        this.sessionMap.delete(serializeSessionKey(key));
        await this.storage.delete(key);
    }

    async get<T>(key: SessionKey, type: Constructor<T>): Promise<T> {
        let session = this.sessionMap.get(serializeSessionKey(key));
        if (session) {
            return session.current as T;
        }
        const existing = await this.storage.get(key);
        const current = existing ? plainToClass(type, existing) : new type();
        (current as HasFields).key = key;
        (current as HasFields).sessionManager = this;
        session = {
            key,
            current: current as HasFields,
            original: JSON.stringify(classToPlain(current))
        };
        this.sessionMap.set(serializeSessionKey(key), session);
        return current;
    }

    async find<T extends Session>(
        filter: Partial<SessionKey>,
        type: SessionConstructor<T>
    ): Promise<T | undefined> {
        filter.type ??= type.type;
        filter.namespace ??= type.namespace;
        const result = await this.storage.find(filter);
        if (!result) {
            return;
        }
        const [key, plainSession] = result;
        const session = plainToClass(type, plainSession);
        (session as HasFields).key = key;
        (session as HasFields).sessionManager = this;
        this.sessionMap.set(serializeSessionKey(key), {
            key,
            current: session as HasFields,
            original: JSON.stringify(plainSession)
        });
        return session;
    }
}
