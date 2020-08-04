import { locales } from "@replikit/i18n";
import { StorageLocale } from "@replikit/storage";

locales.add("ru", StorageLocale, {
    userNotFound: "Пользователь не найден",
    currentUserNotFound: "Текущий пользователь не найден",
    channelNotFound: "Канал не найден",
    currentChannelNotFound: "Текущий канал не найден",
    memberNotFound: "Участник не найден"
});
