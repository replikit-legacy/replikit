import { config, hook, invokeHook, createScope, applyMixins } from "@replikit/core";
import {
    ConnectionManager,
    User,
    Channel,
    Member,
    registerGlobalStorageConverters,
    AccountContextExtension,
    UserRepository,
    ChannelRepository,
    MemberRepository
} from "@replikit/storage";
import { MemberContext } from "@replikit/router";
import { Constructor } from "@replikit/core/typings";

registerGlobalStorageConverters();

/** @internal */
export const logger = createScope("storage");

export const connection = new ConnectionManager();

export async function registerBasicRepositories(connection: ConnectionManager): Promise<void> {
    connection.registerRepository("users", User, { autoIncrement: true });
    connection.registerRepository("channels", Channel, { autoIncrement: true });
    connection.registerRepository("members", Member);
    connection.registerRepositoryExtension(User, UserRepository);
    connection.registerRepositoryExtension(Channel, ChannelRepository);
    connection.registerRepositoryExtension(Member, MemberRepository);
    await connection.getCollection(Channel).createIndexes([{ key: { controller: 1, localId: 1 } }]);
    await connection
        .getCollection(User)
        .createIndexes([
            { key: { username: 1 }, unique: true, collation: { locale: "en_US", strength: 2 } },
            { key: { accounts: 1 } }
        ]);
}

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
    await registerBasicRepositories(connection);
});

applyMixins(MemberContext as Constructor, [AccountContextExtension as Constructor]);
