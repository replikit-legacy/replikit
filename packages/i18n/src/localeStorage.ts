import { Locale } from "@replikit/i18n/typings";
import { deepmerge, config } from "@replikit/core";
import {
    MissingFallbackLocaleError,
    UnableToResolveLocaleError
} from "@replikit/i18n";
import { HasFields } from "@replikit/core/typings";

export class LocaleStorage {
    private readonly locales = new Map<string, Locale>();
    private readonly resolvedLocales = new Map<string, Locale>();

    updateLocales(): void {
        const fallbackLocale = this.locales.get(config.i18n.fallbackLocale);
        if (!fallbackLocale) {
            throw new MissingFallbackLocaleError();
        }
        for (const [lang, locale] of this.locales.entries()) {
            if (lang === config.i18n.fallbackLocale) {
                continue;
            }
            const resolvedLocale = {} as Locale;
            for (const namespaceName in locale) {
                const namespace = locale[namespaceName as keyof Locale];
                const fallbackNamespace =
                    fallbackLocale[namespaceName as keyof Locale];
                if (!fallbackNamespace) {
                    throw new MissingFallbackLocaleError(namespaceName);
                }
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                resolvedLocale[namespaceName as keyof Locale] = deepmerge(
                    {} as HasFields,
                    fallbackNamespace as HasFields,
                    namespace as HasFields
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ) as any;
            }
            this.resolvedLocales.set(lang, resolvedLocale);
        }
    }

    add<T extends keyof Locale>(
        lang: string,
        namespace: T,
        translation: Partial<Locale[T]>
    ): void {
        let locale = this.locales.get(lang);
        if (!locale) {
            locale = {} as Locale;
            this.locales.set(lang, locale);
        }
        locale[namespace] = translation as Locale[T];
    }

    resolve(lang?: string): Locale {
        const resolvedLang = lang ?? config.i18n.defaultLocale;
        const locale = this.resolvedLocales.get(resolvedLang);
        if (locale) {
            return locale;
        }
        const fallbackLocale = this.locales.get(config.i18n.fallbackLocale);
        if (fallbackLocale) {
            return fallbackLocale;
        }
        throw new UnableToResolveLocaleError(lang);
    }
}
