import { setupTemp, expectDirectoryToMatchSnapshot } from "@replikit/test-utils";
import { createModule } from "@replikit/cli";
import { createProject } from "./shared";

setupTemp();

jest.setTimeout(120000);

describe("ProjectManager", () => {
    it.each(["npm", "yarn", "yarn-lerna"])("should generate %s project", async type => {
        const useYarn = type !== "npm";
        const useLerna = type !== "yarn";

        const manager = await createProject(useYarn, useLerna, false);
        await expectDirectoryToMatchSnapshot(manager.root);
    });

    it("should generate project with hook support", async () => {
        const manager = await createProject(false, false, true);
        await expectDirectoryToMatchSnapshot(manager.root);
    });

    it.each(["with", "without"])("should add a module to the project %s logger", async t => {
        const addLoger = t === "with";
        const manager = await createProject(false, false, false);
        await createModule(manager, "test-module", ["@replikit/test"], addLoger);
        await expectDirectoryToMatchSnapshot(manager.root);
    });
});
