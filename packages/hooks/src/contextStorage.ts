import { AsyncLocalStorage } from "async_hooks";
import { MessageContext } from "@replikit/router";
import { SafeFunction } from "@replikit/core/typings";
import { ContextUnaccessibleError } from "@replikit/hooks";

const contextStorage = new AsyncLocalStorage<MessageContext>();

/** @internal */
export function startContextTracking(context: MessageContext, handler: SafeFunction): void {
    contextStorage.run(context, handler);
}

export function useContext(): MessageContext {
    const context = contextStorage.getStore();
    if (!context) {
        throw new ContextUnaccessibleError();
    }
    return context;
}
