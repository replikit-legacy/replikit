import { ChannelContext } from "@replikit/router";
import { Extension } from "@replikit/core";
import {
    Channel,
    ChannelNotFoundError,
    CacheResult,
    FallbackStrategy,
    ConnectionManager,
    connection,
    ChannelRepository,
    extractArguments,
    loadExtensions
} from "@replikit/storage";

@Extension
export class ChannelContextExtension extends ChannelContext {
    _connection: ConnectionManager;

    get connection(): ConnectionManager {
        return this._connection ?? connection;
    }

    @CacheResult
    private async fetchChannel(): Promise<Channel | undefined> {
        const repo = this.connection.getRepository(ChannelRepository);
        return repo.findByLocal(this.controller.name, this.channel.id);
    }

    async getChannel(...args: unknown[]): Promise<Channel> {
        const [fallbackStrategy, extensions] = extractArguments(args, FallbackStrategy.Error);
        const channel = await this.fetchChannel();
        if (channel) {
            loadExtensions(channel, ...extensions);
            return channel;
        }
        if (fallbackStrategy === FallbackStrategy.Undefined) {
            return undefined!;
        }
        if (fallbackStrategy === FallbackStrategy.Create) {
            const repo = this.connection.getRepository(ChannelRepository);
            const channel = repo.create({
                controller: this.controller.name,
                localId: this.channel.id
            });
            loadExtensions(channel, ...extensions);
            await channel.save();
            return channel;
        }
        throw new ChannelNotFoundError();
    }
}
