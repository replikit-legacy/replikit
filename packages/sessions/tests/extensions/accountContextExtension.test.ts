import { AccountContextExtension, SessionManager, SessionType } from "@replikit/sessions";
import {
    ChannelTestSession,
    MemberTestSession,
    AccountTestSession,
    UserTestSession
} from "../shared";
import { createMessageEvent, DatabaseTestManager } from "@replikit/test-utils";
import { HasFields } from "@replikit/core/typings";
import { User } from "@replikit/storage";

function createExtension(type: SessionType): AccountContextExtension {
    const storage = new Map<string, HasFields>();
    const key = type === SessionType.Member ? `${type}_test_test_1_1` : `${type}_test_test_1`;
    storage.set(key, { test: 123 });
    const extension = new AccountContextExtension(createMessageEvent());
    extension.sessionManager = new SessionManager(storage);
    return extension;
}

describe("AccountContextExtension", () => {
    it.each([
        ["channel", SessionType.Channel, ChannelTestSession],
        ["account", SessionType.Account, AccountTestSession],
        ["member", SessionType.Member, MemberTestSession]
    ])("should get a %s session by type", async (_, extensionType, sessionType) => {
        const extension = createExtension(extensionType);
        const result = await extension.getSession(sessionType);
        expect(result).toBeDefined();
        expect(result.test).toBe(123);
    });

    it("should get a user session by type", async () => {
        const testManager = new DatabaseTestManager();
        await testManager.connect();

        const repo = testManager.connection.getRepository(User);
        await repo.create({ accounts: [{ controller: "test", localId: 1 }] }).save();

        const extension = createExtension(SessionType.User);
        ((extension as unknown) as HasFields)._connection = testManager.connection;
        const result = await extension.getSession(UserTestSession);
        expect(result).toBeDefined();
        expect(result.test).toBe(123);

        await testManager.close();
    });
});
