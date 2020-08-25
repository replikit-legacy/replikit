import { Entity, loadExtensions, Member, User, Channel } from "@replikit/storage";
import { HasFields } from "@replikit/core/typings";
import { DatabaseTestManager } from "@replikit/test-utils";

let testManager: DatabaseTestManager;

beforeEach(() => {
    testManager = new DatabaseTestManager();
    return testManager.connect();
});

afterEach(() => {
    return testManager.close();
});

class TestExtension {
    static readonly key = "test";

    test?: number;

    getTest(): number {
        return this.test ?? 0;
    }
}

describe("Entity", () => {
    it("should load extension by type", () => {
        const entity = new Entity();
        entity.loadExtension(TestExtension);
        expect(((entity as unknown) as HasFields).test).toBeInstanceOf(TestExtension);
    });

    it("should get extension by type", () => {
        const entity = new Entity();
        const extension = entity.getExtension(TestExtension);
        expect(extension).toBeInstanceOf(TestExtension);
    });

    it("should load extension from existing plain object", () => {
        const entity = new Entity();
        ((entity as unknown) as HasFields).test = { test: 123 };
        const extension = entity.getExtension(TestExtension);
        expect(extension).toBeDefined();
        expect(extension.getTest()).toBe(123);
    });

    it("should load extensions using loadExtensions helper", () => {
        const entity = new Entity();
        loadExtensions(entity, TestExtension);
        expect(entity.test.getTest()).toBe(0);
    });

    it("should delete channel with members", async () => {
        const channelRepository = testManager.connection.getRepository(Channel);
        const channel = channelRepository.create({ controller: "test", localId: 1 });
        await channel.save();

        const memberRepository = testManager.connection.getRepository(Member);
        await memberRepository
            .create({ _id: { controller: "test", channelId: 1, accountId: 1 } })
            .save();

        await channel.delete();

        expect(await channelRepository.collection.countDocuments()).toBe(0);
        expect(await memberRepository.collection.countDocuments()).toBe(0);
    });

    it("should delete user with members", async () => {
        const userRepository = testManager.connection.getRepository(User);
        const user = userRepository.create({ accounts: [{ controller: "test", localId: 1 }] });
        await user.save();

        const memberRepository = testManager.connection.getRepository(Member);
        await memberRepository
            .create({ _id: { controller: "test", channelId: 1, accountId: 1 } })
            .save();

        await user.delete();

        expect(await userRepository.collection.countDocuments()).toBe(0);
        expect(await memberRepository.collection.countDocuments()).toBe(0);
    });
});
