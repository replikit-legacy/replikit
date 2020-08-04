import { locales } from "@replikit/i18n";
import { StorageLocale } from "@replikit/storage";

locales.add("en", StorageLocale, {
    userNotFound: "User not found",
    currentUserNotFound: "Current user not found",
    channelNotFound: "Channel not found",
    currentChannelNotFound: "Current channel not found",
    memberNotFound: "Member not found"
});
