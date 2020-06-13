import { User as _User } from "@replikit/storage/typings";
import { Account, Entity, Member, CacheResult } from "@replikit/storage";
import { Type } from "class-transformer";

export class User extends Entity {
    _id: number;

    @Type(() => Account)
    accounts: Account[] = [];

    @CacheResult
    getMember(
        controller: string,
        channelId: number
    ): Promise<Member | undefined> {
        const repo = this.repository.connection.getRepository(Member);
        const account = this.accounts.find(x => x.controller === controller);
        if (!account) {
            return Promise.resolve(undefined);
        }
        return repo.findOne({
            _id: { controller, channelId, accountId: account.localId }
        });
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface User extends _User {}
