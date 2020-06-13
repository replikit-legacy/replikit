import { AccountInfo, ChannelEventPayload } from "@replikit/core/typings";

export interface AccountEventPayload extends ChannelEventPayload {
    account: AccountInfo;
}
