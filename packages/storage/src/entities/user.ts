import { User as _User } from "@replikit/storage/typings";
import { Account, Entity, Member, MemberRepository, Memoize } from "@replikit/storage";
import { Type, Exclude } from "class-transformer";
import { Identifier } from "@replikit/core/typings";

export class User extends Entity {
    _id: number;

    @Exclude()
    get account(): Account {
        return this.accounts[0];
    }

    @Type(() => Account)
    accounts: Account[] = [];

    getAccount(controller: string): Account | undefined {
        return this.accounts.find(x => x.controller === controller);
    }

    @Memoize
    getMember(controller: string, channelId: Identifier): Promise<Member | undefined> {
        const repo = this.repository.connection.getRepository(MemberRepository);
        const account = this.accounts.find(x => x.controller === controller);
        if (!account) {
            return Promise.resolve(undefined);
        }
        return repo.findByLocal(controller, channelId, account.localId);
    }

    async delete(): Promise<void> {
        const memberCollection = this.repository.connection.getCollection(Member);
        await Promise.all([
            super.delete(),
            memberCollection.deleteMany({
                $or: this.accounts.map(x => ({
                    "_id.controller": x.controller,
                    "_id.accountId": x.localId
                }))
            })
        ]);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface User extends _User {}
