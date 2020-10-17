import { FilterKeysNot, Identifier } from "@replikit/core/typings";
import { View } from "@replikit/views";

export type PropField<T = unknown, R extends boolean = boolean> = T & {
    __propRequired: R;
};

export type InferPropType<P> = P extends PropField<infer T> ? T : P;

type ViewPropFields<T> = {
    [K in keyof T]: T[K] extends PropField
        ? T[K]["__propRequired"] extends true
            ? InferPropType<T[K]>
            : InferPropType<T[K]> | undefined
        : never;
};

type PickNotNever<T> = Pick<T, FilterKeysNot<T, never | undefined>>;

export interface ViewTarget {
    controller: string;
    accountId: Identifier;
}

export type ViewProps<T extends View> = Partial<PickNotNever<ViewPropFields<T>>>;
