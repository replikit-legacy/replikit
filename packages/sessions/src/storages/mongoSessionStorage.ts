import { SessionStorage } from "@replikit/sessions/typings";
import { ConnectionManager } from "@replikit/storage";
import { hook, ModuleNotFoundError } from "@replikit/core";
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

let connection: ConnectionManager;
let isUsed = false;

hook("core:startup:ready", () => {
    if (!isUsed) {
        return;
    }
    connection = getConnection()!;
    if (!connection) {
        throw new ModuleNotFoundError("@replikit/storage", "MongoSesionStorage");
    }
});

export class MongoSessionStorage implements SessionStorage {
    constructor() {
        isUsed = true;
    }

    /** @internal */
    _connection?: ConnectionManager;

    /** @internal */
    private get connection(): ConnectionManager {
        return this._connection ?? connection;
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
}
