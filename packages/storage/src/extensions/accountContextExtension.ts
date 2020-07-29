import { AccountContext } from "@replikit/router";
import { Extension, config } from "@replikit/core";
import {
    CacheResult,
    connection,
    User,
    UserNotFoundError,
    FallbackStrategy,
    Repository,
    Account,
    ConnectionManager,
    Member,
    MemberNotFoundError,
    loadExtensions,
    extractArguments
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

    @CacheResult
    async getMember(...args: unknown[]): Promise<Member> {
        const [fallbackStrategy, extensions] = extractArguments(
            args,
            config.storage.memberFallbackStrategy
        );
        const repo = this.connection.getRepository(Member);
        const _id = {
            controller: this.controller.name,
            channelId: this.channel.id,
            accountId: this.account.id
        };
        const member = await repo.findOne({ _id });
        if (member) {
            loadExtensions(member, ...extensions);
            return member;
        }
        if (fallbackStrategy === FallbackStrategy.Undefined) {
            return undefined!;
        }
        if (fallbackStrategy === FallbackStrategy.Create) {
            const member = repo.create({ _id });
            loadExtensions(member, ...extensions);
            await member.save();
            return member;
        }
        throw new MemberNotFoundError();
    }

    async getChannelMember(channelId: number): Promise<Member | undefined> {
        const repo = this.connection.getRepository(Member);
        return repo.findOne({
            _id: {
                controller: this.controller.name,
                channelId,
                accountId: this.account.id
            }
        });
    }
}
