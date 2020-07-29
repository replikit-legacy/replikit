import { LocaleStorage, ChannelContextExtension } from "@replikit/i18n";
import { TestLocale } from "@replikit/i18n/tests";

describe("ChannelContextExtension", () => {
    it("should get default locale", () => {
        const localeStorage = new LocaleStorage();
        localeStorage.add("en", TestLocale, { hello: "hello" });

        const extension = new ChannelContextExtension(undefined!);
        extension._localeStorage = localeStorage;

        expect(extension.getLocale(TestLocale).hello).toBe("hello");
    });
});
