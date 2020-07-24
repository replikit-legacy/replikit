import { hook, updateConfig, config } from "@replikit/core";
import { LocaleStorage } from "@replikit/i18n";

updateConfig({ i18n: { defaultLocale: "en", fallbackLocale: "en" } });

export const locales = new LocaleStorage();

hook("core:settings:update", previous => {
    if (!previous.i18n) {
        return;
    }
    if (previous.i18n.fallbackLocale !== config.i18n.fallbackLocale) {
        locales.updateLocales();
    }
});

hook("core:startup:init", () => {
    locales.updateLocales();
});
