import { DatabaseTestManager } from "@replikit/test-utils";
import { User } from "@replikit/storage";

let testManager: DatabaseTestManager;

beforeEach(() => {
    testManager = new DatabaseTestManager();
    return testManager.connect();
});

afterEach(() => {
    return testManager.close();
});

describe("Repository", () => {
    it("should create entity from plain object", () => {
        const repository = testManager.connection.getRepository(User);
        const entity = repository.create({ username: "test" });
        expect(entity.username).toBe("test");
    });

    it("should create entity using defaults", () => {
        const repository = testManager.connection.getRepository(User);
        repository.setDefault("username", "test");
        const entity = repository.create();
        expect(entity.username).toBe("test");
    });

    it("should get entities by QueryBuilder", async () => {
        const repository = testManager.connection.getRepository(User);
        await repository.collection.insertOne({ username: "test" } as User);

        const result = await repository.query(q => {
            return q.filter({ username: "test" });
        });
        expect(result).toHaveLength(1);
        expect(result[0].username).toBe("test");
    });
});
