import { EventName, EventMap, EventHandler } from "@replikit/core/typings";

let _handler: EventHandler;

export function processEvent<T extends EventName>(type: T, payload: EventMap[T]): void {
    if (_handler) {
        _handler({ type, payload });
    }
}

export function hasHandler(): boolean {
    return _handler !== undefined;
}

export function setHandler(handler: EventHandler): void {
    _handler = handler;
}
