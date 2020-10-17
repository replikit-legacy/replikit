import { DatabaseTestManager } from "@replikit/test-utils";
import { MongoSessionStorage } from "@replikit/sessions";
import { HasFields } from "@replikit/core/typings";
import { createSessionKey } from "../shared";

let testManager: DatabaseTestManager;

beforeEach(() => {
    testManager = new DatabaseTestManager();
    return testManager.connect();
});

afterEach(() => {
    return testManager.close();
});

function createStorage(): MongoSessionStorage {
    const storage = new MongoSessionStorage();
    storage._connection = testManager.connection;
    return storage;
}

describe("MongoSessionStorage", () => {
    it("should set a value", async () => {
        const storage = createStorage();
        await storage.set(createSessionKey(), { test: 123 });

        const collection = testManager.connection.getRawCollection<HasFields>("sessions");
        const session = await collection.findOne({ _id: createSessionKey() });
        expect(session).toBeDefined();
        expect(session!.test).toBe(123);
    });

    it("should get a value", async () => {
        const collection = testManager.connection.getRawCollection<HasFields>("sessions");
        await collection.insertOne({
            _id: (createSessionKey() as unknown) as undefined,
            test: 123
        });

        const storage = createStorage();
        const session = await storage.get(createSessionKey());
        expect(session).toBeDefined();
        expect(session!.test).toBe(123);
    });
});
