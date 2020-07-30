import { AccountInfo, EventPayload } from "@replikit/core/typings";

export interface AccountEventPayload extends EventPayload {
    account: AccountInfo;
}
