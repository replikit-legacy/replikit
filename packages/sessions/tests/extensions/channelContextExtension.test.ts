import {
    SessionType,
    ChannelContextExtension,
    SessionManager,
    InvalidSessionTypeError
} from "@replikit/sessions";
import { ChannelTestSession, AccountTestSession } from "../shared";
import { createMessageEvent } from "@replikit/test-utils";
import { HasFields } from "@replikit/core/typings";

function createExtension(): ChannelContextExtension {
    const storage = new Map<string, HasFields>();
    storage.set(`${SessionType.Channel}_test_test_1`, { test: 123 });
    const extension = new ChannelContextExtension(createMessageEvent());
    extension.sessionManager = new SessionManager(storage);
    return extension;
}

describe("ChannelContextExtension", () => {
    it("should get a channel session by type", async () => {
        const extension = createExtension();
        const result = await extension.getSession(ChannelTestSession);
        expect(result.test).toBe(123);
    });

    it("should throw an error if session type is not a channel", () => {
        const extension = createExtension();
        const action = () => void extension.getSession(AccountTestSession);
        expect(action).toThrow(InvalidSessionTypeError);
    });
});
