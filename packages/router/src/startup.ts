import { hook, setHandler } from "@replikit/core";
import {
    router,
    MessageContext,
    AccountContext,
    ChannelContext,
    ContextFactoryStorage,
    contextFactories
} from "@replikit/router";
import {
    MessageEvent,
    AccountEvent,
    ChannelEvent
} from "@replikit/core/typings";

function createChannelContext<T extends ChannelEvent>(
    event: T
): ChannelContext<T> {
    return new ChannelContext(event);
}

function createMessageContext(event: MessageEvent): MessageContext {
    return new MessageContext(event);
}

function createAccountContext(event: AccountEvent): AccountContext {
    return new AccountContext(event);
}

export function registerBasicContextFactories(
    contextFactories: ContextFactoryStorage
): void {
    contextFactories.register("channel:title:edited", createChannelContext);
    contextFactories.register("channel:photo:edited", createChannelContext);
    contextFactories.register("channel:photo:deleted", createChannelContext);

    contextFactories.register("message:received", createMessageContext);
    contextFactories.register("message:edited", createMessageContext);
    contextFactories.register("message:deleted", createMessageContext);

    contextFactories.register("account:joined", createAccountContext);
    contextFactories.register("account:left", createAccountContext);
}

registerBasicContextFactories(contextFactories);

hook("core:startup:init", () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setHandler(router.process.bind(router));
});
