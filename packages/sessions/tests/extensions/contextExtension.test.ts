import {
    SessionType,
    SessionManager,
    InvalidSessionTypeError,
    ContextExtension
} from "@replikit/sessions";
import {
    ChannelTestSession,
    AccountTestSession,
    MemberTestSession,
    UserTestSession
} from "@replikit/sessions/tests";
import { createMessageEvent, DatabaseTestManager } from "@replikit/test-utils";
import { HasFields } from "@replikit/core/typings";
import { User } from "@replikit/storage";
import {
    Context,
    AccountContext,
    ChannelContext,
    MemberContext,
    MessageContext
} from "@replikit/router";

function createContextByType(type: SessionType): Context {
    const event = createMessageEvent();
    switch (type) {
        case SessionType.Account:
        case SessionType.User:
            return new AccountContext(event);
        case SessionType.Channel:
            return new ChannelContext(event);
        case SessionType.Member:
            return new MemberContext(event);
        case SessionType.Message:
            return new MessageContext(event);
    }
}

function createContext(type: SessionType): Context {
    const storage = new Map<string, HasFields>();
    const context = createContextByType(type) as ContextExtension;
    const key = type === SessionType.Member ? `test:test:${type}:1:1` : `test:test:${type}:1`;
    storage.set(key, { test: 123 });
    context.sessionManager = new SessionManager(storage);
    return context;
}

describe("ContextExtension", () => {
    it("should get a channel session by type", async () => {
        const context = createContext(SessionType.Channel);
        const result = await context.getSession(ChannelTestSession);
        expect(result.test).toBe(123);
    });

    it.each([
        ["account", "channel", SessionType.Channel, AccountTestSession],
        ["member", "channel", SessionType.Channel, MemberTestSession],
        ["user", "channel", SessionType.Channel, UserTestSession],
        ["member", "account", SessionType.Account, MemberTestSession]
    ])(
        "should throw an error when trying to get %s from %s context",
        async (_, __, sessionType, session) => {
            const context = createContext(sessionType);
            const result = context.getSession(session);
            await expect(result).rejects.toThrow(InvalidSessionTypeError);
        }
    );

    it.each([
        ["channel", SessionType.Channel, ChannelTestSession],
        ["account", SessionType.Account, AccountTestSession],
        ["member", SessionType.Member, MemberTestSession]
    ])("should get a %s session by type", async (_, extensionType, sessionType) => {
        const context = createContext(extensionType);
        const result = await context.getSession(sessionType);
        expect(result).toBeDefined();
        expect(result.test).toBe(123);
    });

    it("should get a user session by type", async () => {
        const testManager = new DatabaseTestManager();
        await testManager.connect();

        const repo = testManager.connection.getRepository(User);
        await repo.create({ accounts: [{ controller: "test", localId: 1 }] }).save();

        const context = createContext(SessionType.User);
        ((context as unknown) as HasFields)._connection = testManager.connection;
        const result = await context.getSession(UserTestSession);
        expect(result).toBeDefined();
        expect(result.test).toBe(123);

        await testManager.close();
    });
});
