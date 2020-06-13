import { DatabaseTestManager, createMessageEvent } from "@replikit/test-utils";
import {
    ChannelContextExtension,
    Channel,
    ChannelNotFoundError,
    FallbackStrategy
} from "@replikit/storage";

let testManager: DatabaseTestManager;

beforeEach(() => {
    testManager = new DatabaseTestManager();
    return testManager.connect();
});

afterEach(() => {
    return testManager.close();
});

function createExtension(): ChannelContextExtension {
    const event = createMessageEvent();
    const extension = new ChannelContextExtension(event);
    extension._connection = testManager.connection;
    return extension;
}

describe("ChannelContextExtension", () => {
    it("should get a channel from the database", async () => {
        await testManager.connection
            .getCollection(Channel)
            .insertOne({ controller: "test", localId: 1 });

        const extension = createExtension();
        const channel = await extension.getChannel();
        expect(channel).toBeDefined();
        expect(channel.localId).toBe(1);
    });

    it("should throw an error if channel not found", async () => {
        const extension = createExtension();
        const result = extension.getChannel();
        await expect(result).rejects.toThrow(ChannelNotFoundError);
    });

    it("should return undefined if channel not found", async () => {
        const extension = createExtension();
        const result = await extension.getChannel(FallbackStrategy.Undefined);
        expect(result).toBeUndefined();
    });

    it("should create a new channel if not found", async () => {
        const extension = createExtension();
        const result = await extension.getChannel(FallbackStrategy.Create);
        expect(result).toBeDefined();

        const repository = testManager.connection.getRepository(Channel);
        const channel = await repository.findOne({ _id: 1 });
        expect(channel).toBeDefined();
        expect(channel!.localId).toBe(1);
    });
});
