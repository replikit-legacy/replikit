import { MemberContext } from "@replikit/router";
import { Extension } from "@replikit/core";
import {
    CacheResult,
    connection,
    FallbackStrategy,
    ConnectionManager,
    Member,
    MemberNotFoundError,
    loadExtensions,
    extractArguments,
    MemberRepository
} from "@replikit/storage";

@Extension
export class MemberContextExtension extends MemberContext {
    _connection: ConnectionManager;

    get connection(): ConnectionManager {
        return this._connection ?? connection;
    }

    @CacheResult
    private async fetchMember(): Promise<Member | undefined> {
        const repo = this.connection.getRepository(MemberRepository);
        return repo.findByLocal(this.controller.name, this.channel.id, this.account.id);
    }

    async getMember(...args: unknown[]): Promise<Member> {
        const [fallbackStrategy, extensions] = extractArguments(args, FallbackStrategy.Create);
        const repo = this.connection.getRepository(Member);
        const member = await this.fetchMember();
        if (member) {
            loadExtensions(member, ...extensions);
            return member;
        }
        if (fallbackStrategy === FallbackStrategy.Undefined) {
            return undefined!;
        }
        if (fallbackStrategy === FallbackStrategy.Create) {
            const member = repo.create({
                _id: {
                    controller: this.controller.name,
                    channelId: this.channel.id,
                    accountId: this.account.id
                }
            });
            loadExtensions(member, ...extensions);
            await member.save();
            return member;
        }
        throw new MemberNotFoundError();
    }

    async getChannelMember(channelId: number): Promise<Member | undefined> {
        const repo = this.connection.getRepository(MemberRepository);
        return repo.findByLocal(this.controller.name, channelId, this.account.id);
    }
}
