import { SessionStorage } from "@replikit/sessions/typings";
import { ConnectionManager } from "@replikit/storage";
import { ModuleNotFoundError } from "@replikit/core";
import { HasFields } from "@replikit/core/typings";

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

    async get(key: string): Promise<HasFields | undefined> {
        const collection = this.connection.getRawCollection<HasFields>("sessions");
        const session = await collection.findOne({ _id: key });
        if (session) {
            return session;
        }
    }

    async set(key: string, value: HasFields): Promise<void> {
        const collection = this.connection.getRawCollection<HasFields>("sessions");
        await collection.replaceOne({ _id: key }, value, { upsert: true });
    }

    async delete(key: string): Promise<void> {
        const collection = this.connection.getRawCollection<HasFields>("sessions");
        await collection.deleteOne({ _id: key });
    }
}
