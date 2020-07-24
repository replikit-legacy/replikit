import { locales } from "@replikit/i18n";
import { StorageLocale } from "@replikit/storage";

locales.add("ru", StorageLocale, {
    userNotFound: "Пользователь не найден",
    channelNotFound: "Канал не найден"
});
