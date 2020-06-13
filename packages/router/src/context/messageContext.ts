import { AccountContext } from "@replikit/router";
import { MessageEvent, InMessage } from "@replikit/core/typings";
import { MessageContext as _MessageContext } from "@replikit/router/typings";

export class MessageContext extends AccountContext {
    constructor(readonly event: MessageEvent) {
        super(event);
    }

    get message(): InMessage {
        return this.event.payload.message;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MessageContext extends _MessageContext {}
