import {
    config,
    hook,
    invokeHook,
    updateConfig,
    createScope
} from "@replikit/core";
import {
    ConnectionManager,
    User,
    Channel,
    Member,
    FallbackStrategy,
    registerGlobalStorageConverters
} from "@replikit/storage";

registerGlobalStorageConverters();

/** @internal */
export const logger = createScope("storage");

export const connection = new ConnectionManager();

export function registerBasicRepositories(connection: ConnectionManager): void {
    connection.registerRepository("users", User, { autoIncrement: true });
    connection.registerRepository("channels", Channel, { autoIncrement: true });
    connection.registerRepository("members", Member);
}

updateConfig({
    storage: {
        channelFallbackStrategy: FallbackStrategy.Error,
        userFallbackStrategy: FallbackStrategy.Create,
        memberFallbackStrategy: FallbackStrategy.Create
    }
});

hook("core:startup:init", async () => {
    try {
        await invokeHook("storage:database:init");
        await connection.connect(config.storage.connection);
        logger.info("Database connection established");
        await invokeHook("storage:database:done");
        await invokeHook("storage:database:ready");
    } catch (e) {
        logger.error(`Error while connecting to the database: ${e}`);
    }
});

hook("core:shutdown:init", async () => {
    await connection.close();
});

hook("storage:database:done", async () => {
    registerBasicRepositories(connection);
    await connection
        .getCollection(Channel)
        .createIndexes([{ key: { controller: 1, localId: 1 } }]);
    await connection
        .getCollection(User)
        .createIndexes([{ key: { username: 1, accounts: 1 } }]);
});
