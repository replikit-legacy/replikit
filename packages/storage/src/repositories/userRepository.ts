import { Repository, User } from "@replikit/storage";
import { Identifier } from "@replikit/core/typings";

export class UserRepository extends Repository<User> {
    findByAccount(controller: string, localId: Identifier): Promise<User | undefined> {
        return this.findOne({ accounts: { $elemMatch: { controller, localId } } });
    }

    findByUsername(username: string): Promise<User | undefined> {
        return this.findOne({ username });
    }

    findByAccounts(controller: string, localIds: Identifier[]): Promise<User[]> {
        return this.findMany({
            accounts: { $elemMatch: { controller, localId: { $in: localIds } } }
        });
    }
}
