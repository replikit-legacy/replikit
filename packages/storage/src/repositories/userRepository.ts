import { Repository, User } from "@replikit/storage";
import { Identifier } from "@replikit/core/typings";

export class UserRepository extends Repository<User> {
    findByAccount(controller: string, localId: Identifier): Promise<User | undefined> {
        return this.findOne({ accounts: { $elemMatch: { controller, localId } } });
    }
}
