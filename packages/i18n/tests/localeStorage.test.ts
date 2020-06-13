import { LocaleStorage } from "@replikit/i18n";

describe("LocaleStorage", () => {
    it("should register and resolve the fallback locale", () => {
        const localeStorage = new LocaleStorage();
        localeStorage.add("en", "test", { test: "Hi" });

        const locale = localeStorage.resolve();
        expect(locale.test.test).toEqual("Hi");
    });

    it("should resolve missing localization items using fallback locale", () => {
        const localeStorage = new LocaleStorage();
        localeStorage.add("en", "test", { test: "Hi" });
        localeStorage.add("ru", "test", {});
        localeStorage.updateLocales();

        const locale = localeStorage.resolve("ru");
        expect(locale.test.test).toEqual("Hi");
    });

    it("should use target locale rather than fallback locale", () => {
        const localeStorage = new LocaleStorage();
        localeStorage.add("en", "test", { test: "Hi" });
        localeStorage.add("ru", "test", { test: "Привет" });
        localeStorage.updateLocales();

        const locale = localeStorage.resolve("ru");
        expect(locale.test.test).toEqual("Привет");
    });
});
