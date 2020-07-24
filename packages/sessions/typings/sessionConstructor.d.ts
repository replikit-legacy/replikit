import { Constructor } from "@replikit/core/typings";
import { SessionType } from "@replikit/sessions";

export interface SessionConstructor<T = unknown> extends Constructor<T> {
    type: SessionType;
    namespace: string;
}
