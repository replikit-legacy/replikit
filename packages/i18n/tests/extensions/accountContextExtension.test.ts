import { LocaleStorage, AccountContextExtension } from "@replikit/i18n";
import { TestLocale } from "i18n/tests/shared";
import { AccountEventPayload } from "@replikit/core/typings";

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
