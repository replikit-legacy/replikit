import { Account as _Account } from "@replikit/storage/typings";
import { InaccessibleAccountInfoError, CacheResult } from "@replikit/storage";
import { AccountInfo } from "@replikit/core/typings";
import { Controller, resolveController } from "@replikit/core";

export class Account {
    getController(): Controller {
        return resolveController(this.controller);
    }

    @CacheResult
    async getAccountInfo(): Promise<AccountInfo> {
        const info = await this.getController().getAccountInfo(this.localId);
        if (!info) {
            throw new InaccessibleAccountInfoError();
        }
        return info;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Account extends _Account {}
