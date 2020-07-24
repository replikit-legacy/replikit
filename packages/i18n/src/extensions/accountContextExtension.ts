import { AccountContext } from "@replikit/router";
import { Extension } from "@replikit/core";
import { LocaleConstructor } from "@replikit/i18n/typings";
import { LocaleStorage, locales } from "@replikit/i18n";

@Extension
export class AccountContextExtension extends AccountContext {
    /** @internal */
    _localeStorage?: LocaleStorage;

    private get localeStorage(): LocaleStorage {
        return this._localeStorage ?? locales;
    }

    getLocale<T>(type: LocaleConstructor<T>): T {
        return this.localeStorage.resolve(type, this.account.language);
    }
}
