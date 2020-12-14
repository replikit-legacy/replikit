import { Identifier } from "@replikit/core/typings";
import { SessionType } from "@replikit/sessions";

export interface SessionKey {
    controller: string;
    namespace: string;
    type: SessionType;
    channelId?: Identifier;
    accountId?: Identifier;
    userId?: number;
    messageId?: Identifier;
    [customKey: string]: unknown;
}
