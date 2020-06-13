import { HookMap } from "@replikit/core/typings";

export type HookName = keyof HookMap;

export type HookHandler<T extends HookName = HookName> = (
    payload: HookMap[T]
) => Promise<void> | void;
