import { DatabaseTestManager } from "@replikit/test-utils";
import {
    User,
    UnlinkedEntityError,
    Member,
    Channel,
    Account
} from "@replikit/storage";

let testManager: DatabaseTestManager;

beforeEach(() => {
    testManager = new DatabaseTestManager();
    return testManager.connect();
});

afterEach(() => {
    return testManager.close();
});

describe("storage", () => {
    it("should write and read a document using collection", async () => {
        const collection = testManager.connection.getCollection(User);
        await collection.insertOne({
            _id: 1,
            username: "test",
            accounts: [] as Account[]
        } as User);

        const user = await collection.findOne({ _id: 1 });
        expect(user).toBeDefined();
        expect(user!.username).toBe("test");
    });

    it("should insert and read a document using repository", async () => {
        const repository = testManager.connection.getRepository(User);
        const user = repository.create({ username: "test" });
        await user.save();

        const users = await repository.findMany();
        expect(users).toHaveLength(1);
        expect(users[0].username).toBe("test");
    });

    it("should throw an error if calling repository-speicifc method on unlinked entity", () => {
        const user = new User();
        expect(() => user.save()).toThrow(UnlinkedEntityError);
        expect(() => user.delete()).toThrow(UnlinkedEntityError);
    });

    it("should update an existing document by save method", async () => {
        const repository = testManager.connection.getRepository(User);
        await repository.collection.insertOne({
            _id: 1,
            username: "test",
            accounts: [] as Account[]
        } as User);

        const user = (await repository.findOne({ _id: 1 }))!;
        expect(user.username).toBe("test");

        user.username = "another";
        await user.save();

        const anotherUser = (await repository.findOne({ _id: 1 }))!;
        expect(anotherUser.username).toBe("another");
    });

    it("should get the user using member entity", async () => {
        await testManager.connection.getCollection(User).insertOne({
            _id: 1,
            username: "test",
            accounts: [{ localId: 1, controller: "test" } as Account]
        } as User);

        const repository = testManager.connection.getRepository(Member);
        const member = repository.create({
            _id: { accountId: 1, channelId: 1, controller: "test" }
        });

        const user = await member.getUser();
        expect(user.username).toBe("test");
    });

    it("should get the channel using member entity", async () => {
        await testManager.connection
            .getCollection(Channel)
            .insertOne({ _id: 1, localId: 1, controller: "test" });

        const repository = testManager.connection.getRepository(Member);
        const member = repository.create({
            _id: { accountId: 1, channelId: 1, controller: "test" }
        });

        const channel = await member.getChannel();
        expect(channel.controller).toBe("test");
    });
});
