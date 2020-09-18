import { Constructor } from "@replikit/core/typings";
import { Session, SessionType } from "@replikit/sessions";

export interface SessionConstructor<T extends Session = Session> extends Constructor<T> {
    type: SessionType;
    namespace: string;
}
