import { AccountContext } from "@replikit/router";
import { Extension, config } from "@replikit/core";
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
    UserNotFoundError
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
    async getUser(...args: unknown[]): Promise<User> {
        const [fallbackStrategy, extensions] = extractArguments(
            args,
            config.storage.userFallbackStrategy
        );
        const repo = this.connection.getRepository(User);
        const user = await repo.findOne({
            accounts: {
                $elemMatch: {
                    controller: this.controller.name,
                    localId: this.account.id
                }
            }
        });
        if (user) {
            loadExtensions(user, ...extensions);
            return user;
        }
        if (fallbackStrategy === FallbackStrategy.Undefined) {
            return undefined!;
        }
        if (fallbackStrategy === FallbackStrategy.Create) {
            const user = await createUser(repo, this.controller.name, this.account);
            loadExtensions(user, ...extensions);
            return user;
        }
        throw new UserNotFoundError();
    }
}
