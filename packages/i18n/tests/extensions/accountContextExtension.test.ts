import { LocaleStorage, AccountContextExtension } from "@replikit/i18n";
import { AccountEventPayload } from "@replikit/core/typings";
import { TestLocale } from "@replikit/i18n/tests";

describe("AccountContextExtension", () => {
    it("should get locale using account language", () => {
        const localeStorage = new LocaleStorage();
        localeStorage.add("en", TestLocale, {});
        localeStorage.add("ru", TestLocale, { hello: "здарова" });
        localeStorage.updateLocales();

        const extension = new AccountContextExtension({
            type: "account:joined",
            payload: { account: { language: "ru" } } as AccountEventPayload
        });
        extension._localeStorage = localeStorage;

        expect(extension.getLocale(TestLocale).hello).toBe("здарова");
    });
});
