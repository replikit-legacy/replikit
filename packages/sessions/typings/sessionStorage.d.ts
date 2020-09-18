import { HasFields } from "@replikit/core/typings";

export interface SessionStorage {
    set(key: string, value: HasFields): unknown | Promise<unknown>;
    delete(key: string): unknown | Promise<unknown>;
    get(key: string): Promise<HasFields | undefined> | HasFields | undefined;
}
