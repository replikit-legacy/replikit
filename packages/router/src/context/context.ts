import { ContextBase, Context as _Context } from "@replikit/router/typings";
import { Event } from "@replikit/core/typings";
import { Controller } from "@replikit/core";

export class Context<T extends Event = Event> implements ContextBase {
    constructor(readonly event: T) {}

    skipped = false;

    get controller(): Controller {
        return this.event.payload.controller;
    }

    get payload(): T["payload"] {
        return this.event.payload;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context extends _Context {}
