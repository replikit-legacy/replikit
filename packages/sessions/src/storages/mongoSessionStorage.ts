import { SessionKey, SessionStorage } from "@replikit/sessions/typings";
import { ConnectionManager } from "@replikit/storage";
import { ModuleNotFoundError } from "@replikit/core";
import { HasFields } from "@replikit/core/typings";
import { Collection } from "mongodb";

type StorageModule = typeof import("@replikit/storage");

function getConnection(): ConnectionManager | undefined {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return (require("@replikit/storage") as StorageModule).connection;
    } catch {
        return undefined;
    }
}

export class MongoSessionStorage implements SessionStorage {
    /** @internal */
    _connection?: ConnectionManager;

    /** @internal */
    private get connection(): ConnectionManager {
        if (this._connection) {
            return this._connection;
        }
        this._connection = getConnection()!;
        if (!this._connection) {
            throw new ModuleNotFoundError("@replikit/storage", "MongoSesionStorage");
        }
        return this._connection;
    }

    async get(key: SessionKey): Promise<HasFields | undefined> {
        const session = await this.collection.findOne({ _id: key });
        return session || undefined;
    }

    private get collection(): Collection<HasFields> {
        return this.connection.getRawCollection<HasFields>("sessions");
    }

    async set(key: SessionKey, value: HasFields): Promise<void> {
        await this.collection.replaceOne({ _id: key }, value, { upsert: true });
    }

    async delete(key: SessionKey): Promise<void> {
        await this.collection.deleteOne({ _id: key });
    }

    async find(key: Partial<SessionKey>): Promise<[SessionKey, HasFields] | undefined> {
        const filter: HasFields = {};
        for (const k in key) {
            filter[`_id.${k}`] = key[k as keyof SessionKey];
        }
        const sessions = await this.collection
            .find()
            .filter(filter)
            .sort("_id.messageId", -1)
            .limit(1)
            .toArray();
        const session = sessions[0];
        return session ? [session._id as SessionKey, session] : undefined;
    }
}
