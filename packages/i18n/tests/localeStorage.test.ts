import { LocaleStorage } from "@replikit/i18n";
import { TestLocale } from "i18n/tests/shared";

describe("LocaleStorage", () => {
    it("should register and resolve the fallback locale", () => {
        const localeStorage = new LocaleStorage();
        localeStorage.add("en", TestLocale, { hello: "Hi" });

        const locale = localeStorage.resolve(TestLocale);
        expect(locale.hello).toEqual("Hi");
    });

    it("should resolve missing localization items using fallback locale", () => {
        const localeStorage = new LocaleStorage();
        localeStorage.add("en", TestLocale, { hello: "Hi" });
        localeStorage.add("ru", TestLocale, {});
        localeStorage.updateLocales();

        const locale = localeStorage.resolve(TestLocale);
        expect(locale.hello).toEqual("Hi");
    });

    it("should use target locale rather than fallback locale", () => {
        const localeStorage = new LocaleStorage();
        localeStorage.add("en", TestLocale, { hello: "Hi" });
        localeStorage.add("ru", TestLocale, { hello: "Привет" });
        localeStorage.updateLocales();

        const locale = localeStorage.resolve(TestLocale, "ru");
        expect(locale.hello).toEqual("Привет");
    });
});
