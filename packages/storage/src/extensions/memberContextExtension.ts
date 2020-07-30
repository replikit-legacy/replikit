import { MemberContext } from "@replikit/router";
import { Extension, config } from "@replikit/core";
import {
    CacheResult,
    connection,
    FallbackStrategy,
    ConnectionManager,
    Member,
    MemberNotFoundError,
    loadExtensions,
    extractArguments
} from "@replikit/storage";

@Extension
export class MemberContextExtension extends MemberContext {
    _connection: ConnectionManager;

    get connection(): ConnectionManager {
        return this._connection ?? connection;
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
