import { SessionType } from "@replikit/sessions";

export class ChannelTestSession {
    static readonly type = SessionType.Channel;
    static readonly namespace = "test";

    test: number;

    getTest(): number {
        return this.test;
    }
}

export class MemberTestSession {
    static readonly type = SessionType.Member;
    static readonly namespace = "test";

    test: number;
}

export class AccountTestSession {
    static readonly type = SessionType.Account;
    static readonly namespace = "test";

    test: number;
}
