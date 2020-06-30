import { ConnectionManager, registerBasicRepositories } from "@replikit/storage";
import { MongoMemoryServer } from "mongodb-memory-server";

export class DatabaseTestManager {
    private server: MongoMemoryServer;
    readonly connection = new ConnectionManager();

    async connect(): Promise<void> {
        this.server = new MongoMemoryServer();
        const uri = await this.server.getConnectionString();
        await this.connection.connect(uri);
        registerBasicRepositories(this.connection);
    }

    async close(): Promise<void> {
        await this.connection.close();
        await this.server.stop();
    }
}
