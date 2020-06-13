import { code } from "@replikit/test-utils";
import { ConfigManager } from "@replikit/cli";

describe("TSConfigManager", () => {
    it("should add an import declaration to file without imports", () => {
        const config = code`
        import { Configuration } from "@replikit/core";

        const config: Configuration = {};

        export default config;`;

        const manager = new ConfigManager();
        manager.load(config);
        manager.addModule("@replikit/test");

        const result = manager.serialize();
        expect(result).toMatchSnapshot();
    });

    it("should add an import declaration to file with one import", () => {
        const config = code`
        import { Configuration } from "@replikit/core";

        import "@replikit/another";

        const config: Configuration = {};

        export default config;`;

        const manager = new ConfigManager();
        manager.load(config);
        manager.addModule("@replikit/test");

        const result = manager.serialize();
        expect(result).toMatchSnapshot();
    });

    it("should remove the import declaration from file with one import", () => {
        const config = code`
        import { Configuration } from "@replikit/core";

        import "@replikit/test";

        const config: Configuration = {};

        export default config;`;

        const manager = new ConfigManager();
        manager.load(config);
        manager.removeModule("@replikit/test");

        const result = manager.serialize();
        expect(result).toMatchSnapshot();
    });

    it("should remove the import declaration from typescript file with multiple imports", () => {
        const config = code`
        import { Configuration } from "@replikit/core";

        import "@replikit/another";
        import "@replikit/test";

        const config: Configuration = {};

        export default config;`;

        const manager = new ConfigManager();
        manager.load(config);
        manager.removeModule("@replikit/test");

        const result = manager.serialize();
        expect(result).toMatchSnapshot();
    });

    it("should check the typescript import declaration existence", () => {
        const config = code`
        import { Configuration } from "@replikit/core";

        import "@replikit/test";

        const config: Configuration = {};

        export default config;`;

        const manager = new ConfigManager();
        manager.load(config);

        expect(manager.checkModule("@replikit/test")).toBeTruthy();
        expect(manager.checkModule("@replikit/another")).toBeFalsy();
    });

    it("should init new configuration", () => {
        const manager = new ConfigManager();
        manager.init();

        const result = manager.serialize();
        expect(result).toMatchSnapshot();
    });

    it("should compile to an empty importless js configuration", () => {
        const manager = new ConfigManager();
        manager.init();

        const result = manager.compile();
        expect(result).toMatchSnapshot();
    });

    it("should compile to an importless js configuration with modules", () => {
        const config = code`
        import { Configuration } from "@replikit/core";

        import "@replikit/test";

        const config: Configuration = {
            test: { test: "test" }
        };

        export default config;`;

        const manager = new ConfigManager();
        manager.load(config);

        const result = manager.compile();
        expect(result).toMatchSnapshot();
    });
});
