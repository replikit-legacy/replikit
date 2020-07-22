import { SessionType } from "@replikit/sessions";

export class BetUserSession {
    static readonly namespace = "bet";
    static readonly type = SessionType.User;

    activeBet?: number;
}
