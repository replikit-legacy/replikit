import { ChannelContext } from "@replikit/router";
import { AccountContext as _AccountContext } from "@replikit/router/typings";
import { AccountEvent, AccountInfo } from "@replikit/core/typings";

export class AccountContext extends ChannelContext {
    constructor(readonly event: AccountEvent) {
        super(event);
    }

    get account(): AccountInfo {
        return this.event.payload.account;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AccountContext extends _AccountContext {}
