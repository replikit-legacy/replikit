import { SessionType } from "@replikit/sessions";

export class ChannelTestSession {
    static readonly namespace = "test";
    static readonly type = SessionType.Channel;

    test: number;

    getTest(): number {
        return this.test;
    }
}

export class MemberTestSession {
    static readonly namespace = "test";
    static readonly type = SessionType.Member;

    test: number;
}

export class AccountTestSession {
    static readonly namespace = "test";
    static readonly type = SessionType.Account;

    test: number;
}

export class UserTestSession {
    static readonly namespace = "test";
    static readonly type = SessionType.User;

    test: number;
}
