import { Member as _Member, MemberId } from "@replikit/storage/typings";
import { ChannelInfo, AccountInfo } from "@replikit/core/typings";
import { Controller, tryResolveController } from "@replikit/core";
import {
    Channel,
    User,
    Entity,
    ChannelNotFoundError,
    UserNotFoundError,
    CacheResult,
    ChannelRepository,
    UserRepository
} from "@replikit/storage";

export class Member extends Entity {
    _id: MemberId;

    getController(): Controller | undefined {
        return tryResolveController(this._id.controller);
    }

    @CacheResult
    async getChannelInfo(): Promise<ChannelInfo | undefined> {
        return this.getController()?.getChannelInfo(this._id.channelId);
    }

    @CacheResult
    async getAccountInfo(): Promise<AccountInfo | undefined> {
        return this.getController()?.getAccountInfo(this._id.accountId);
    }

    @CacheResult
    async getChannel(): Promise<Channel> {
        const repository = this.repository.connection.getRepository(ChannelRepository);
        const channel = await repository.findByLocal(this._id.controller, this._id.channelId);
        if (!channel) {
            throw new ChannelNotFoundError();
        }
        return channel;
    }

    @CacheResult
    async getUser(): Promise<User> {
        const repository = this.repository.connection.getRepository(UserRepository);
        const user = await repository.findByAccount(this._id.controller, this._id.accountId);
        if (!user) {
            throw new UserNotFoundError();
        }
        return user;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Member extends _Member {}
