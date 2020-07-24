import { ChannelContext } from "@replikit/router";
import { LocaleConstructor } from "@replikit/i18n/typings";
import { locales, LocaleStorage } from "@replikit/i18n";
import { Extension } from "@replikit/core";

@Extension
export class ChannelContextExtension extends ChannelContext {
    /** @internal */
    _localeStorage?: LocaleStorage;

    private get localeStorage(): LocaleStorage {
        return this._localeStorage ?? locales;
    }

    getLocale<T>(type: LocaleConstructor<T>): T {
        return this.localeStorage.resolve(type);
    }
}
