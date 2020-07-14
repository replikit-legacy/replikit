import { hook, updateConfig, config } from "@replikit/core";
import { MessageContext, ChannelContext } from "@replikit/router";
import { LocaleStorage } from "@replikit/i18n";
import { LocaleConstructor } from "@replikit/i18n/typings";

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
