import { FilterKeysNot, SafeFunction } from "@replikit/core/typings";

export type PlainObject<T> = T extends Record<string, unknown>
    ? { [K in keyof T]: PlainObject<T[K]> }
    : T extends (infer U)[]
    ? PlainObject<U>[]
    : Pick<T, FilterKeysNot<T, SafeFunction>>;
