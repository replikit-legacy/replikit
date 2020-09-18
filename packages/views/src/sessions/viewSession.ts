import { Session, SessionType } from "@replikit/sessions";
import { Expose } from "class-transformer";

export class ViewSession extends Session {
    static readonly namespace = "view";
    static readonly type = SessionType.Message;

    @Expose({ name: "__replikit_actions" })
    actions?: string[];
}

export interface ViewSession {
    [key: string]: unknown;
}
