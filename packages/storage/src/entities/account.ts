import { Account as _Account } from "@replikit/storage/typings";
import { CacheResult } from "@replikit/storage";
import { AccountInfo } from "@replikit/core/typings";
import { Controller, tryResolveController } from "@replikit/core";

export class Account {
    getController(): Controller | undefined {
        return tryResolveController(this.controller);
    }

    @CacheResult
    async getAccountInfo(): Promise<AccountInfo | undefined> {
        return this.getController()?.getAccountInfo(this.localId);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Account extends _Account {}
