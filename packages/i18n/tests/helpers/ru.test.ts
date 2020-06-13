import { ru } from "@replikit/i18n";

describe("ru helpers", () => {
    it("should pluralize string", () => {
        const results: string[] = [];
        for (let i = 1; i <= 30; i++) {
            const result = ru.plural(i, "$ яблоко", "$ яблока", "$ яблок");
            results.push(result);
        }
        expect(results).toMatchSnapshot();
    });
});
