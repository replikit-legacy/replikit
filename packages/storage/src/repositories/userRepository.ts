import { Repository, User } from "@replikit/storage";

export class UserRepository extends Repository<User> {
    findByAccount(controller: string, localId: number): Promise<User | undefined> {
        return this.findOne({ accounts: { $elemMatch: { controller, localId } } });
    }
}
