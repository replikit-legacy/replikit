import { Member as _Member, MemberId } from "@replikit/storage/typings";
import { ChannelInfo, AccountInfo } from "@replikit/core/typings";
import { resolveController, Controller } from "@replikit/core";
import {
    Channel,
    User,
    Entity,
    ChannelNotFoundError,
    UserNotFoundError,
    InaccessibleChannelInfoError,
    InaccessibleAccountInfoError,
    CacheResult,
    ChannelRepository,
    UserRepository
} from "@replikit/storage";

export class Member extends Entity {
    _id: MemberId;

    getController(): Controller {
        return resolveController(this._id.controller);
    }

    @CacheResult
    async getChannelInfo(): Promise<ChannelInfo> {
        const controller = this.getController();
        const info = await controller.getChannelInfo(this._id.channelId);
        if (!info) {
            throw new InaccessibleChannelInfoError();
        }
        return info;
    }

    @CacheResult
    async getAccountInfo(): Promise<AccountInfo> {
        const controller = this.getController();
        const info = await controller.getAccountInfo(this._id.accountId);
        if (!info) {
            throw new InaccessibleAccountInfoError();
        }
        return info;
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
