import { SessionType } from "@replikit/sessions";

export class RandomUserSession {
    static readonly namespace = "random";
    static readonly type = SessionType.User;

    completions: string[] = [];
}
