import { Identifier } from "@replikit/core/typings";

export interface ForwardedOutMessage {
    messageId: Identifier;
    channelId: Identifier;
}
