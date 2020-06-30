import { ChannelInfo, ChannelEvent, SendedMessage, OutMessage } from "@replikit/core/typings";
import { Controller } from "@replikit/core";
import { ChannelContext as _ChannelContext, ContextBase } from "@replikit/router/typings";
import { MessageBuilder } from "@replikit/messages";
import { resolveMessage } from "@replikit/router";

export class ChannelContext<T extends ChannelEvent = ChannelEvent> implements ContextBase {
    constructor(readonly event: T) {}

    skipped = false;

    get controller(): Controller {
        return this.event.payload.controller;
    }

    get channel(): ChannelInfo {
        return this.event.payload.channel;
    }

    reply(message: OutMessage | MessageBuilder | string): Promise<SendedMessage> {
        const resolvedMessage = resolveMessage(message);
        return this.controller.sendMessage(this.channel.id, resolvedMessage);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChannelContext extends _ChannelContext {}
