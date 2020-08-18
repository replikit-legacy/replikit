import { AccountContext } from "@replikit/router";
import { Extension } from "@replikit/core";
import {
    CacheResult,
    extractArguments,
    ConnectionManager,
    connection,
    User,
    loadExtensions,
    FallbackStrategy,
    Repository,
    Account,
    UserNotFoundError,
    UserRepository
} from "@replikit/storage";
import { AccountInfo } from "@replikit/core/typings";

async function createUser(
    repository: Repository<User>,
    controller: string,
    info: AccountInfo
): Promise<User> {
    const user = info.username
        ? (await repository.findOne({ username: info.username })) ??
          repository.create({ username: info.username })
        : repository.create({ username: `${controller}${info.id}` });
    const account = new Account();
    account.controller = controller;
    account.localId = info.id;
    user.accounts.push(account);
    await user.save();
    return user;
}

@Extension
export class AccountContextExtension extends AccountContext {
    _connection: ConnectionManager;

    get connection(): ConnectionManager {
        return this._connection ?? connection;
    }

    @CacheResult
    private async fetchUser(): Promise<User | undefined> {
        const repo = this.connection.getRepository(UserRepository);
        return repo.findByAccount(this.controller.name, this.account.id);
    }

    async getUser(...args: unknown[]): Promise<User> {
        const [fallbackStrategy, extensions] = extractArguments(args, FallbackStrategy.Create);
        const user = await this.fetchUser();
        if (user) {
            loadExtensions(user, ...extensions);
            return user;
        }
        if (fallbackStrategy === FallbackStrategy.Undefined) {
            return undefined!;
        }
        if (fallbackStrategy === FallbackStrategy.Create) {
            const repo = this.connection.getRepository(User);
            const user = await createUser(repo, this.controller.name, this.account);
            loadExtensions(user, ...extensions);
            return user;
        }
        throw new UserNotFoundError();
    }
}
