import { createTestManager } from "@replikit/test-utils";
import { MissingConverterError } from "@replikit/commands";

describe("ConverterStorage", () => {
    it("should resolve a converter", () => {
        const { testManager } = createTestManager();
        const result = testManager.converter(Number);
        expect(result).toBeDefined();
    });

    it("should throw an error if converter was not found", () => {
        const { testManager } = createTestManager();
        const result = (): unknown => testManager.converters.resolve(Map);
        expect(result).toThrow(MissingConverterError);
    });
});
