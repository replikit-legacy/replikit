/* eslint-disable @typescript-eslint/ban-types */
// https://stackoverflow.com/a/60864781/10502674
type _IfEquals<X, Y, T> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? T
    : never;

type _PlainObjectKeys<T> = {
    [P in keyof T]: _IfEquals<
        { [Q in P]: T[P] extends Function ? never : T[P] },
        { -readonly [Q in P]: T[P] },
        P
    >;
}[keyof T];

type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

export type PlainObject<T extends object> = {
    [K in keyof Pick<T, _PlainObjectKeys<T>>]: T[K] extends Date
        ? T[K]
        : T[K] extends (infer U)[]
        ? U extends object
            ? PlainObject<U>[]
            : U[]
        : T[K] extends object
        ? PlainObject<T[K]>
        : T[K];
};

type a = PlainObject<{ test: unknown[] }>;
