import { Channel as _Channel } from "@replikit/storage/typings";
import { ChannelInfo } from "@replikit/core/typings";
import {
    Local,
    InaccessibleChannelInfoError,
    CacheResult
} from "@replikit/storage";

export class Channel extends Local {
    @CacheResult
    async getChannelInfo(): Promise<ChannelInfo> {
        const info = await this.getController().getChannelInfo(this.localId);
        if (!info) {
            throw new InaccessibleChannelInfoError();
        }
        return info;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Channel extends _Channel {}
