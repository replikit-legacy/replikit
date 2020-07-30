import { LocaleStorage, AccountContextExtension } from "@replikit/i18n";
import { MemberEventPayload } from "@replikit/core/typings";
import { TestLocale } from "@replikit/i18n/tests";

describe("AccountContextExtension", () => {
    it("should get locale using account language", () => {
        const localeStorage = new LocaleStorage();
        localeStorage.add("en", TestLocale, {});
        localeStorage.add("ru", TestLocale, { hello: "здарова" });
        localeStorage.updateLocales();

        const extension = new AccountContextExtension({
            type: "member:joined",
            payload: { account: { language: "ru" } } as MemberEventPayload
        });
        extension._localeStorage = localeStorage;

        expect(extension.getLocale(TestLocale).hello).toBe("здарова");
    });
});
