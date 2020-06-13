import { AccountInfo, ChannelInfo } from "@replikit/core/typings";

export interface RandomLocale {
    dataDeleted: string;
    userEditedMessage(account: AccountInfo): string;
    accountLeft(account: AccountInfo): string;
    accountJoined(account: AccountInfo): string;
    channelTitleEdited(channel: ChannelInfo): string;
    channelPhotoEdited: string;
    channelPhotoDeleted: string;
    keepSilence: string;
    deactivateSilentMode: string;
    silentModeActivated: string;
    silentModeDeactivated: string;
}
