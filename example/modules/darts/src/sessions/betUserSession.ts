import { Session, SessionType } from "@replikit/sessions";

export class BetUserSession extends Session {
    static readonly namespace = "bet";
    static readonly type = SessionType.User;

    activeBet?: number;
}
