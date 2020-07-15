import { SessionManager } from "@replikit/sessions";
import { HasFields } from "@replikit/core/typings";
import { ChannelTestSession } from "./shared";

interface SessionManagerKit {
    manager: SessionManager;
    storage: Map<string, HasFields>;
}

function createSessionManager(): SessionManagerKit {
    const storage = new Map<string, HasFields>();
    const manager = new SessionManager(storage);
    return { manager, storage };
}

describe("SessionManager", () => {
    it("should get a session by key and type and then save it", async () => {
        const { manager, storage } = createSessionManager();
        const session = await manager.get("test", ChannelTestSession);
        expect(session.test).toBeUndefined();
        expect(session.getTest()).toBeUndefined();

        session.test = 123;
        await manager.save();

        const plainSession = storage.get("test");
        expect(plainSession).toBeDefined();
        expect(plainSession!.test).toBe(123);
    });

    it("should get the same session by repeated call", async () => {
        const { manager } = createSessionManager();
        const session1 = await manager.get("test", ChannelTestSession);
        const session2 = await manager.get("test", ChannelTestSession);
        expect(session1).toBe(session2);
    });

    it("should get a session from stored one", async () => {
        const { manager, storage } = createSessionManager();
        storage.set("test", { test: 123 });

        const session = await manager.get("test", ChannelTestSession);
        expect(session.test).toBe(123);
        expect(session.getTest()).toBe(123);
    });
});
