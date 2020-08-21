import "@replikit/authorization";
import { DatabaseTestManager, TestManagerSuite, createTestManager } from "@replikit/test-utils";
import { MessageContext } from "@replikit/router";
import { MemberContextExtension, User, Member, Channel } from "@replikit/storage";
import { fromText } from "@replikit/messages";
import { PlainObject } from "@replikit/storage/typings";
import { TestUserPermission, TestMemberPermission } from "@replikit/permissions/tests";

let dbTestManager: DatabaseTestManager;

beforeEach(() => {
    dbTestManager = new DatabaseTestManager();
    return dbTestManager.connect();
});

afterEach(() => {
    return dbTestManager.close();
});

function createExtensionTestManager(): TestManagerSuite {
    const suite = createTestManager();
    const manager = dbTestManager;
    suite.testManager.contextFactories.register("message:received", event => {
        const context = new MessageContext(event);
        ((context as unknown) as MemberContextExtension)._connection = manager.connection;
        return context;
    });
    return suite;
}

async function insertUser(id: number, permissions: string[]): Promise<void> {
    const collection = dbTestManager.connection.getCollection(User);
    await collection.insertOne(({
        username: `test${id}`,
        permissions,
        roles: [],
        accounts: [{ controller: "test", localId: id }]
    } as unknown) as PlainObject<User>);
}

async function insertMember(
    accountId: number,
    permissions: string[],
    channelId = 0,
    controller = "test"
): Promise<void> {
    const collection = dbTestManager.connection.getCollection(Member);
    await collection.insertOne({
        _id: { controller, channelId, accountId },
        permissions,
        roles: []
    });
}

async function insertChannel(channelId: number, controller = "test"): Promise<void> {
    const repository = dbTestManager.connection.getRepository(Channel);
    const channel = repository.create({ controller, localId: channelId });
    await channel.save();
}

describe("CommandBuilderExtension", () => {
    it("should authorize a user permission", async () => {
        const { testManager, command } = createExtensionTestManager();

        await insertUser(1, [TestUserPermission.Test1.id]);
        await insertUser(2, []);

        command("test")
            .authorizeUser(TestUserPermission.Test1)
            .handler(() => fromText("Access allowed"))
            .register();

        await testManager.processCommand("/test", 1);
        await testManager.processCommand("/test", 2);
        await testManager.processCommand("/test", 3);

        expect.assertions(3);
    });

    it("should authorize a member permission", async () => {
        const { testManager, command } = createExtensionTestManager();

        await insertMember(1, [TestMemberPermission.Test1.id]);
        await insertMember(2, []);

        command("test")
            .authorizeMember(TestMemberPermission.Test1)
            .handler(() => fromText("Access allowed"))
            .register();

        await testManager.processCommand("/test", 1);
        await testManager.processCommand("/test", 2);
        await testManager.processCommand("/test", 3);

        expect.assertions(3);
    });

    it("should authorize a member permission in another channel of the same controller", async () => {
        const { testManager, command } = createExtensionTestManager();

        await insertMember(1, [TestMemberPermission.Test1.id], 2);
        await insertMember(2, [], 2);

        await insertChannel(2);

        command("test")
            .channel()
            .authorizeMember(TestMemberPermission.Test1)
            .handler(() => fromText("Access allowed"))
            .register();

        await testManager.processCommand("/test 1", 1);
        await testManager.processCommand("/test 1", 2);
        await testManager.processCommand("/test 1", 3);

        expect.assertions(3);
    });

    it("should authorize a member permission in the same channel", async () => {
        const { testManager, command } = createExtensionTestManager();

        await insertMember(1, [TestMemberPermission.Test1.id], 0);
        await insertMember(2, [], 0);

        await insertChannel(0);

        command("test")
            .channel()
            .authorizeMember(TestMemberPermission.Test1)
            .handler(() => fromText("Access allowed"))
            .register();

        await testManager.processCommand("/test", 1);
        await testManager.processCommand("/test", 2);
        await testManager.processCommand("/test", 3);

        expect.assertions(3);
    });

    it("should authorize a member permission in another channel of another controller", async () => {
        const { testManager, command } = createExtensionTestManager();

        const users = dbTestManager.connection.getCollection(User);
        await users.insertOne({
            _id: 0,
            username: "test",
            permissions: [],
            roles: [],
            accounts: [
                { controller: "test", localId: 1 },
                { controller: "another", localId: 2 }
            ]
        });

        await insertChannel(2, "another");
        await insertMember(2, [TestMemberPermission.Test1.id], 2, "another");

        command("test")
            .channel()
            .authorizeMember(TestMemberPermission.Test1)
            .handler(() => fromText("Access allowed"))
            .register();

        await testManager.processCommand("/test 1", 1);
        await testManager.processCommand("/test 1", 2);

        expect.assertions(2);
    });
});
