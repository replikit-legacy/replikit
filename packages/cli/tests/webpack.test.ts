import { createProject } from "./shared";
import { createWebpackConfiguration } from "@replikit/cli";
import { resolve } from "path";
import { Configuration } from "webpack";

jest.setTimeout(120000);

describe("webpack", () => {
    it("should generate a webpack configuration", async () => {
        const project = await createProject(false, false, false);
        await project.createModule("test");

        const config = {
            modules: ["@replikit/static", "@test-project/test"],
            outDir: "./dist"
        };

        const result = createWebpackConfiguration(project, config);
        const expectedOutputPath = resolve(project.root, "dist");
        const expectedAliasPath = resolve(project.root, "modules/test/src/index.ts");
        expect(result).toMatchSnapshot({
            resolve: {
                alias: { "@test-project/test": expect.any(String) }
            },
            output: { path: expect.any(String) }
        });
        expect(result.output!.path).toBe(expectedOutputPath);
        const aliasPath = result.resolve!.alias!["@test-project/test"];
        expect(aliasPath).toBe(expectedAliasPath);
    });

    it("should pass webpack configuration throw user specified transformer", async () => {
        const project = await createProject(false, false, false);

        const config = {
            modules: [],
            outDir: "./dist",
            webpack: (config: Configuration) => {
                config.name = "test";
                return config;
            }
        };

        const result = createWebpackConfiguration(project, config);
        expect(result.name).toBe("test");
    });
});
