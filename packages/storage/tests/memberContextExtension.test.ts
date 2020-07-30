import { DatabaseTestManager, createMessageEvent } from "@replikit/test-utils";
import { MemberContextExtension } from "@replikit/storage";
import { MemberContext } from "@replikit/router";
import { TestExtension } from "@replikit/storage/tests";

let testManager: DatabaseTestManager;

beforeEach(() => {
    testManager = new DatabaseTestManager();
    return testManager.connect();
});

afterEach(() => {
    return testManager.close();
});

function createExtension(): MemberContext {
    const event = createMessageEvent();
    const extension = new MemberContextExtension(event);
    extension._connection = testManager.connection;
    return (extension as unknown) as MemberContext;
}

describe("MemberContextExtension", () => {
    it("should create a member with extension", async () => {
        const extension = createExtension();
        const result = await extension.getMember(TestExtension);
        expect(result).toBeDefined();
        expect(result.test).toBeInstanceOf(TestExtension);
    });
});
