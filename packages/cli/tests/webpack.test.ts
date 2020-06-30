import { createProject } from "./shared";
import { createWebpackConfiguration } from "@replikit/cli";
import { resolve } from "path";

jest.setTimeout(120000);

describe("webpack", () => {
    it("should generate a webpack configuration", async () => {
        const project = await createProject(false, false);
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
});
