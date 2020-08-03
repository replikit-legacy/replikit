import { hook, updateConfig, config, applyMixins } from "@replikit/core";
import { LocaleStorage, AccountContextExtension } from "@replikit/i18n";
import { MemberContext } from "@replikit/router";

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

applyMixins(MemberContext, [AccountContextExtension]);
