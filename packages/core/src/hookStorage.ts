import { HookName, HookHandler, HookMap } from "@replikit/core/typings";

interface HandlerCollection {
    [name: string]: HookHandler[];
}

const hooks: HandlerCollection = {};

type Payload<T> = T extends void ? [void] : [T];

export async function invokeHook<T extends HookName>(
    name: T,
    ...payload: Payload<HookMap[T]>
): Promise<void>;
export async function invokeHook(
    name: string,
    ...payload: Payload<unknown>
): Promise<void>;
export async function invokeHook(
    name: string,
    ...payload: Payload<unknown>
): Promise<void> {
    if (!hooks[name]) {
        return;
    }
    for (const handler of hooks[name]) {
        await handler(payload[0] as HookMap[keyof HookMap]);
    }
}

export function hook<T extends HookName>(
    name: T,
    handler: HookHandler<T>
): void;
export function hook(name: string, handler: HookHandler): void;
export function hook(name: string, handler: HookHandler): void {
    if (!hooks[name]) {
        hooks[name] = [];
    }
    hooks[name].push(handler);
}
