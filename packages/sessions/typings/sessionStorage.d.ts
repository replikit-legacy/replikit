import { HasFields } from "@replikit/core/typings";
import { SessionKey } from "@replikit/sessions/typings";

type FindResult =
    | [SessionKey, HasFields]
    | Promise<[SessionKey, HasFields] | undefined>
    | undefined;

export interface SessionStorage {
    set(key: SessionKey, value: HasFields): void | Promise<void>;
    delete(key: SessionKey): void | Promise<void>;
    get(key: SessionKey): Promise<HasFields | undefined> | HasFields | undefined;
    find(filter: Partial<SessionKey>): FindResult;
}
