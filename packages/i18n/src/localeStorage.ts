import { LocaleConstructor } from "@replikit/i18n/typings";
import { deepmerge, config } from "@replikit/core";
import { MissingFallbackLocaleError, UnableToResolveLocaleError } from "@replikit/i18n";
import { HasFields } from "@replikit/core/typings";

export class LocaleStorage {
    private readonly locales = new Map<string, HasFields>();
    private readonly resolvedLocales = new Map<string, HasFields>();

    updateLocales(): void {
        const fallbackLocale = this.locales.get(config.i18n.fallbackLocale);
        if (!fallbackLocale) {
            throw new MissingFallbackLocaleError();
        }
        for (const [lang, locale] of this.locales.entries()) {
            if (lang === config.i18n.fallbackLocale) {
                continue;
            }
            const resolvedLocale: HasFields = {};
            for (const namespaceName in locale) {
                const namespace = locale[namespaceName];
                const fallbackNamespace = fallbackLocale[namespaceName];
                if (!fallbackNamespace) {
                    throw new MissingFallbackLocaleError(namespaceName);
                }
                resolvedLocale[namespaceName] = deepmerge(
                    {},
                    fallbackNamespace as HasFields,
                    namespace as HasFields
                );
            }
            this.resolvedLocales.set(lang, resolvedLocale);
        }
    }

    add<T>(lang: string, type: LocaleConstructor<T>, translation: Partial<T>): void {
        let locale = this.locales.get(lang);
        if (!locale) {
            locale = {};
            this.locales.set(lang, locale);
        }
        locale[type.namespace] = translation;
    }

    resolve<T>(type: LocaleConstructor<T>, lang?: string): T {
        const resolvedLang = lang ?? config.i18n.defaultLocale;
        const resolvedLocale = this.resolvedLocales.get(resolvedLang);
        if (resolvedLocale) {
            return resolvedLocale[type.namespace] as T;
        }
        const fallbackLocale = this.locales.get(config.i18n.fallbackLocale);
        if (fallbackLocale) {
            return fallbackLocale[type.namespace] as T;
        }
        throw new UnableToResolveLocaleError(lang);
    }
}
