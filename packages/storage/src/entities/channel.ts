import { Channel as _Channel } from "@replikit/storage/typings";
import { ChannelInfo } from "@replikit/core/typings";
import { CacheResult, Local, Member } from "@replikit/storage";

export class Channel extends Local {
    @CacheResult
    async getChannelInfo(): Promise<ChannelInfo | undefined> {
        return this.getController()?.getChannelInfo(this.localId);
    }

    async delete(): Promise<void> {
        const memberCollection = this.repository.connection.getCollection(Member);
        await Promise.all([
            super.delete(),
            memberCollection.deleteMany({
                "_id.controller": this.controller,
                "_id.channelId": this.localId
            })
        ]);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Channel extends _Channel {}
