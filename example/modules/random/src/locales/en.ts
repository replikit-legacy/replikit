import { locales } from "@replikit/i18n";

locales.add("en", "random", {
    channelPhotoDeleted: "Channel photo deleted",
    channelPhotoEdited: "Channel photo edited:",
    accountJoined: account => `${account.username} join the channel`,
    accountLeft: account => `${account.username} left the channel`,
    channelTitleEdited: channel => `Channel title edited: ${channel.title}`,
    userEditedMessage: account => `@${account.username} just edited a message`,
    dataDeleted: "[DATA DELETED]",
    keepSilence: "keep silence",
    deactivateSilentMode: "deactivate silent mode",
    silentModeActivated: "Silent mode activated",
    silentModeDeactivated: "Silent mode deactivated"
});
