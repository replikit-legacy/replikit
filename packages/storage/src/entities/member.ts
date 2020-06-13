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
    CacheResult
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
        const repository = this.repository.connection.getRepository(Channel);
        const channel = await repository.findOne({
            controller: this._id.controller,
            localId: this._id.channelId
        });
        if (!channel) {
            throw new ChannelNotFoundError();
        }
        return channel;
    }

    @CacheResult
    async getUser(): Promise<User> {
        const repository = this.repository.connection.getRepository(User);
        const user = await repository.findOne({
            accounts: {
                $elemMatch: {
                    controller: this._id.controller,
                    localId: this._id.accountId
                }
            }
        });
        if (!user) {
            throw new UserNotFoundError();
        }
        return user;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Member extends _Member {}
