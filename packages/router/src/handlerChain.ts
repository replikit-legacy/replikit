import { Handler, ContextBase } from "@replikit/router/typings";

class HandlerWrapper<T extends ContextBase> {
    next?: HandlerWrapper<T>;

    private static readonly finalHandler = (context: ContextBase): void => {
        context.skipped = true;
    };

    constructor(public readonly handler: Handler<T>) {}

    process(context: T): void | Promise<void> {
        const next = this.next
            ? this.next.process.bind(this.next, context)
            : HandlerWrapper.finalHandler.bind(undefined, context);
        return this.handler(context, next);
    }
}

export class HandlerChain<T extends ContextBase> {
    private firstHandler?: HandlerWrapper<T>;
    private lastHandler?: HandlerWrapper<T>;

    use(...handlers: Handler<T>[]): this {
        for (const handler of handlers) {
            const wrapper = new HandlerWrapper(handler);
            if (!this.firstHandler) {
                this.firstHandler = wrapper;
                this.lastHandler = wrapper;
                continue;
            }
            this.lastHandler!.next = wrapper;
            this.lastHandler = wrapper;
        }
        return this;
    }

    process(context: T): void | Promise<void> {
        if (!this.firstHandler) {
            return;
        }
        return this.firstHandler.process(context);
    }
}
