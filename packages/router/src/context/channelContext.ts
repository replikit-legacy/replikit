import { ChannelInfo, ChannelEvent, SendedMessage, OutMessage } from "@replikit/core/typings";
import { ChannelContext as _ChannelContext } from "@replikit/router/typings";
import { MessageBuilder } from "@replikit/messages";
import { resolveMessage, Context } from "@replikit/router";

export class ChannelContext<T extends ChannelEvent = ChannelEvent> extends Context<T> {
    get channel(): ChannelInfo {
        return this.payload.channel;
    }

    reply(message: OutMessage | MessageBuilder | string): Promise<SendedMessage> {
        const resolvedMessage = resolveMessage(message);
        return this.controller.sendMessage(this.channel.id, resolvedMessage);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ChannelContext extends _ChannelContext {}
