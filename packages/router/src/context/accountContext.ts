import { Context } from "@replikit/router";
import { AccountContext as _AccountContext } from "@replikit/router/typings";
import { AccountInfo, AccountEvent } from "@replikit/core/typings";

export class AccountContext<T extends AccountEvent = AccountEvent> extends Context<T> {
    get account(): AccountInfo {
        return this.payload.account;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AccountContext extends _AccountContext {}
