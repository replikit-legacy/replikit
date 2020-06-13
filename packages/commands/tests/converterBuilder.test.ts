import { createTestManager } from "@replikit/test-utils";

describe("ConverterBuilder", () => {
    it("should build a converter", () => {
        const { converter } = createTestManager();
        const result = converter(Number)
            .validator(() => void 0)
            .resolver(() => 123)
            .build();
        expect(result).toMatchSnapshot();
    });

    it("should register a constructed converter in a ConverterStorage", () => {
        const { converter, testManager } = createTestManager({
            excludeBasicConverters: true,
            excludeStorageConverters: true
        });
        converter(Number).register();
        expect(testManager.converters).toMatchSnapshot();
    });
});
