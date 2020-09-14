import { hook, setHandler } from "@replikit/core";
import {
    router,
    MessageContext,
    ChannelContext,
    ContextFactoryStorage,
    contextFactories,
    MemberContext,
    InlineQueryReceivedContext,
    InlineQueryChosenContext,
    ButtonContext
} from "@replikit/router";
import {
    MessageEvent,
    MemberEvent,
    ChannelEvent,
    InlineQueryReceivedEvent,
    InlineQueryChosenEvent,
    ButtonEvent
} from "@replikit/core/typings";

function createChannelContext<T extends ChannelEvent>(event: T): ChannelContext<T> {
    return new ChannelContext(event);
}

function createMessageContext(event: MessageEvent): MessageContext {
    return new MessageContext(event);
}

// function createAccountContext(event: AccountEvent): AccountContext {
//     return new AccountContext(event);
// }

function createMemberContext(event: MemberEvent): MemberContext {
    return new MemberContext(event);
}

function createInlineQueryReceivedContext(
    event: InlineQueryReceivedEvent
): InlineQueryReceivedContext {
    return new InlineQueryReceivedContext(event);
}

function createInlineQueryChosenContext(event: InlineQueryChosenEvent): InlineQueryChosenContext {
    return new InlineQueryChosenContext(event);
}

function createButtonContext(event: ButtonEvent): ButtonContext {
    return new ButtonContext(event);
}

export function registerBasicContextFactories(contextFactories: ContextFactoryStorage): void {
    contextFactories.register("channel:title:edited", createChannelContext);
    contextFactories.register("channel:photo:edited", createChannelContext);
    contextFactories.register("channel:photo:deleted", createChannelContext);

    contextFactories.register("message:received", createMessageContext);
    contextFactories.register("message:edited", createMessageContext);
    contextFactories.register("message:deleted", createMessageContext);

    contextFactories.register("member:joined", createMemberContext);
    contextFactories.register("member:left", createMemberContext);

    contextFactories.register("inline-query:received", createInlineQueryReceivedContext);
    contextFactories.register("inline-query:chosen", createInlineQueryChosenContext);

    contextFactories.register("button:clicked", createButtonContext);
}

registerBasicContextFactories(contextFactories);

hook("core:startup:init", () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setHandler(router.process.bind(router));
});
