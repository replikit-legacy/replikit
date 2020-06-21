// https://stackoverflow.com/a/60864781/10502674
type _IfEquals<X, Y, T> = (<T>() => T extends X ? 1 : 2) extends <
    T
>() => T extends Y ? 1 : 2
    ? T
    : never;

type _PlainObjectKeys<T> = {
    [P in keyof T]: _IfEquals<
        // eslint-disable-next-line @typescript-eslint/ban-types
        { [Q in P]: T[P] extends Function ? never : T[P] },
        { -readonly [Q in P]: T[P] },
        P
    >;
}[keyof T];

export type PlainObject<T> = Pick<T, _PlainObjectKeys<T>>;
