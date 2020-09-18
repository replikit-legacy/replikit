import { Constructor, HasFields } from "@replikit/core/typings";
import { SessionStorage } from "@replikit/sessions/typings";
import { classToPlain, plainToClass } from "class-transformer";

interface StoredSession {
    original: string;
    current: HasFields;
}

export class SessionManager {
    private sessionMap = new Map<string, StoredSession>();

    constructor(private readonly storage: SessionStorage) {}

    private async saveWorker(key: string, session: StoredSession): Promise<void> {
        if (JSON.stringify(session.current) !== session.original) {
            await this.storage.set(key, classToPlain(session.current));
        }
    }

    async saveSession(key: string): Promise<void> {
        const session = this.sessionMap.get(key);
        return session && this.saveWorker(key, session);
    }

    async save(): Promise<void> {
        for (const [key, session] of this.sessionMap.entries()) {
            await this.saveWorker(key, session);
        }
    }

    async delete(key: string): Promise<void> {
        this.sessionMap.delete(key);
        await this.storage.delete(key);
    }

    async get<T>(key: string, type: Constructor<T>): Promise<T> {
        let session = this.sessionMap.get(key);
        if (session) {
            return session.current as T;
        }
        const existing = await this.storage.get(key);
        const current = existing ? plainToClass(type, existing) : new type();
        (current as HasFields).key = key;
        (current as HasFields).sessionManager = this;
        session = { current: current as HasFields, original: JSON.stringify(current) };
        this.sessionMap.set(key, session);
        return current;
    }
}
