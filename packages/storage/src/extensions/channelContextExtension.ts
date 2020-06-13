import { ChannelContext } from "@replikit/router";
import { Extension, config } from "@replikit/core";
import {
    Channel,
    ChannelNotFoundError,
    CacheResult,
    FallbackStrategy,
    ConnectionManager,
    connection
} from "@replikit/storage";

@Extension
export class ChannelContextExtension extends ChannelContext {
    _connection: ConnectionManager;

    get connection(): ConnectionManager {
        return this._connection ?? connection;
    }

    @CacheResult
    async getChannel(fallbackStrategy?: FallbackStrategy): Promise<Channel> {
        fallbackStrategy =
            fallbackStrategy ?? config.storage.channelFallbackStrategy;
        const repo = this.connection.getRepository(Channel);
        const channel = await repo.findOne({
            localId: this.channel.id,
            controller: this.controller.name
        });
        if (channel) {
            return channel;
        }
        if (fallbackStrategy === FallbackStrategy.Undefined) {
            return undefined!;
        }
        if (fallbackStrategy === FallbackStrategy.Create) {
            const channel = repo.create({
                controller: this.controller.name,
                localId: this.channel.id
            });
            await channel.save();
            return channel;
        }
        throw new ChannelNotFoundError();
    }
}
