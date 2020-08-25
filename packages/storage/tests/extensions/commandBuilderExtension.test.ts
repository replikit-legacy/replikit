import "@replikit/storage";
import { command } from "@replikit/commands";
import { createTestManager, DatabaseTestManager, TestManagerSuite } from "@replikit/test-utils";
import { User, Channel, Member, MemberContextExtension } from "@replikit/storage";
import { MessageContext } from "@replikit/router";

describe("CommandBuilderExtension", () => {
    it.each([
        ["with default options", undefined],
        ["with custom name", { name: "custom" }],
        ["as required parameter", { required: true }],
        ["to not use in authorization", { useInAuthorization: false }]
    ])("should add channel parameter %s", (_, options) => {
        const result = command("test")
            .channel(options)
            .build();
        expect(result).toMatchSnapshot();
    });

    it.each([
        ["with default options", undefined],
        ["with custom name", { name: "custom" }],
        ["as required parameter", { required: true }]
    ])("should add user parameter %s", (_, options) => {
        const result = command("test")
            .user(options)
            .build();
        expect(result).toMatchSnapshot();
    });

    it.each([
        ["with default options", undefined],
        ["with custom name", { name: "custom" }],
        ["with custom user parameter name", { userParameterName: "customUser" }],
        ["with required user parameter", { userRequired: true }],
        ["with custom channel parameter name", { channelParameterName: "customChannel" }],
        ["with required channel parameter", { channelRequired: true }],
        ["with channel not used in authorization", { useChannelInAuthorization: false }],
        ["in reverse order of channel and user parameters", { reverse: true }]
    ])("should add member parameter %s", (_, options) => {
        const result = command("test")
            .member(options)
            .build();
        expect(result).toMatchSnapshot();
    });
});

describe("CommandBuilderExtension runtime", () => {
    let dbTestManager: DatabaseTestManager;

    beforeEach(() => {
        dbTestManager = new DatabaseTestManager();
        return dbTestManager.connect();
    });

    afterEach(() => {
        return dbTestManager.close();
    });

    // TODO reuse
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

    it("should resolve member parameter", async () => {
        await dbTestManager.connection
            .getRepository(User)
            .create({ accounts: [{ controller: "test", localId: 0 }] })
            .save();

        await dbTestManager.connection
            .getRepository(Channel)
            .create({ controller: "test", localId: 0 })
            .save();

        await dbTestManager.connection
            .getRepository(Member)
            .create({ _id: { controller: "test", channelId: 0, accountId: 0 } })
            .save();

        const { testManager, command } = createExtensionTestManager();
        command("test")
            .member()
            .handler(context => expect(context.params.member).toBeDefined())
            .register();
        await testManager.processCommand("/test 1 1");
        expect.assertions(1);
    });

    it("should reply an error if member not found", async () => {
        await dbTestManager.connection
            .getRepository(User)
            .create({ accounts: [{ controller: "test", localId: 0 }] })
            .save();

        await dbTestManager.connection
            .getRepository(Channel)
            .create({ controller: "test", localId: 0 })
            .save();

        const { testManager, command } = createExtensionTestManager();
        command("test")
            .member()
            .handler(context => void context)
            .register();
        await testManager.processCommand("/test 1 1");
        expect.assertions(1);
    });
});
