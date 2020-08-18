import { AccountInfo, ChannelInfo } from "@replikit/core/typings";

export class RandomLocale {
    static readonly namespace = "random";

    dataDeleted: string;
    channelPhotoEdited: string;
    channelPhotoDeleted: string;
    keepSilence: string;
    deactivateSilentMode: string;
    silentModeActivated: string;
    silentModeDeactivated: string;

    userEditedMessage: (account: AccountInfo) => string;
    userDeletedMessage: (account: AccountInfo) => string;
    accountLeft: (account: AccountInfo) => string;
    accountJoined: (account: AccountInfo) => string;
    channelTitleEdited: (channel: ChannelInfo) => string;
}
