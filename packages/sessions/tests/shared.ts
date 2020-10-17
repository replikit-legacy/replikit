import { Session, SessionType } from "@replikit/sessions";
import { SessionKey } from "@replikit/sessions/typings";

export class ChannelTestSession extends Session {
    static readonly namespace = "test";
    static readonly type = SessionType.Channel;

    test: number;

    getTest(): number {
        return this.test;
    }
}

export class MemberTestSession extends Session {
    static readonly namespace = "test";
    static readonly type = SessionType.Member;

    test: number;
}

export class AccountTestSession extends Session {
    static readonly namespace = "test";
    static readonly type = SessionType.Account;

    test: number;
}

export class UserTestSession extends Session {
    static readonly namespace = "test";
    static readonly type = SessionType.User;

    test: number;
}

export function createSessionKey(): SessionKey {
    return { controller: "test", namespace: "test", type: 0 };
}
