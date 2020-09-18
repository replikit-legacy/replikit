import { Session, SessionType } from "@replikit/sessions";

export class RandomUserSession extends Session {
    static readonly namespace = "random";
    static readonly type = SessionType.User;

    completions: string[] = [];
}
