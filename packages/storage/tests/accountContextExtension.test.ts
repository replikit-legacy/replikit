import { DatabaseTestManager, createMessageEvent } from "@replikit/test-utils";
import {
    AccountContextExtension,
    User,
    Account,
    UserNotFoundError,
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

function createExtension(): AccountContextExtension {
    const event = createMessageEvent();
    const extension = new AccountContextExtension(event);
    extension._connection = testManager.connection;
    return extension;
}

describe("AccountContextExtension", () => {
    it("should get a user from the database", async () => {
        await testManager.connection.getCollection(User).insertOne({
            username: "test",
            accounts: [{ controller: "test", localId: 1 } as Account]
        } as User);

        const extension = createExtension();
        const user = await extension.getUser();
        expect(user).toBeDefined();
        expect(user.username).toBe("test");
    });

    it("should throw an error if user not found", async () => {
        const extension = createExtension();
        const result = extension.getUser(FallbackStrategy.Error);
        await expect(result).rejects.toThrow(UserNotFoundError);
    });

    it("should return undefined if user not found", async () => {
        const extension = createExtension();
        const result = await extension.getUser(FallbackStrategy.Undefined);
        expect(result).toBeUndefined();
    });

    it("should create a new user if not found", async () => {
        const extension = createExtension();
        const result = await extension.getUser();
        expect(result).toBeDefined();

        const repository = testManager.connection.getRepository(User);
        const user = await repository.findOne({ _id: 1 });
        expect(user).toBeDefined();
        expect(user!.username).toBe("test");
    });
});
