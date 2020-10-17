import { HasFields } from "@replikit/core/typings";
import { Session, SessionType } from "@replikit/sessions";
import { ViewAction, ViewTarget } from "@replikit/views/typings";

export class ViewSession extends Session {
    static readonly namespace = "view";
    static readonly type = SessionType.Message;

    data: HasFields;
    actions: ViewAction[];
    target?: ViewTarget;
}
