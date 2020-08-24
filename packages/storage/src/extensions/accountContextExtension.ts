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
    Account,
    UserNotFoundError,
    UserRepository,
    setCachedResult
} from "@replikit/storage";
import { MongoError } from "mongodb";
import { invokeHook } from "@replikit/core";

@Extension
export class AccountContextExtension extends AccountContext {
    _connection: ConnectionManager;

    get connection(): ConnectionManager {
        return this._connection ?? connection;
    }

    @CacheResult
    async fetchUser(): Promise<User | undefined> {
        const repo = this.connection.getRepository(UserRepository);
        return repo.findByAccount(this.controller.name, this.account.id);
    }

    private async createUser(): Promise<User> {
        const repository = this.connection.getRepository(User);
        const user = repository.create({ username: this.account.username });
        const account = new Account();
        account.controller = this.controller.name;
        account.localId = this.account.id;
        user.accounts.push(account);
        let postfix = 1;
        for (;;) {
            try {
                await user.save();
                break;
            } catch (e) {
                if (e instanceof MongoError && e.code === 11000) {
                    user.username = `${this.account.username}${postfix}`;
                    postfix++;
                    continue;
                }
                throw e;
            }
        }
        if (postfix > 1) {
            await invokeHook("storage:user:conflict", { context: this, user });
        }
        return user;
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
            const user = await this.createUser();
            loadExtensions(user, ...extensions);
            setCachedResult(this, "fetchUser", user);
            return user;
        }
        throw new UserNotFoundError();
    }
}
