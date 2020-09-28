import { setupTemp, expectDirectoryToMatchSnapshot } from "@replikit/test-utils";
import { createModule, ProjectManager, GitController, PMType } from "@replikit/cli";
import { createProject } from "./shared";
import { resolve } from "path";

setupTemp();

jest.setTimeout(120000);

describe("ProjectManager", () => {
    it.each(["npm", "yarn", "yarn-lerna"])("should generate %s project", async type => {
        const useYarn = type !== "npm";
        const useLerna = type !== "yarn";

        const manager = await createProject(useYarn, useLerna);
        await expectDirectoryToMatchSnapshot(manager.root);
    });

    it.each(["with", "without"])("should add a module to the project %s logger", async t => {
        const addLoger = t === "with";
        const manager = await createProject(false, false);
        await createModule(manager, "test-module", ["@replikit/test"], addLoger);
        await expectDirectoryToMatchSnapshot(manager.root);
    });

    it("should add external subrepository, update tsconfig.json and add modules to replikit config", async () => {
        const gitSpy = jest.spyOn(GitController.prototype, "addSubmodule");
        gitSpy.mockImplementation(async function (this: GitController, _, folder) {
            const externalManager = new ProjectManager(resolve(this.path, folder));
            externalManager.setPackageManager(PMType.NPM);
            await externalManager.init();
            await externalManager.createModule("external-module");
        });

        const manager = await createProject(false, false);
        await manager.git.addSubmodule(undefined!, "external-repo");
        await manager.addExternalRepo("external-repo");

        const modules = await manager.getExternalModuleNames("external-repo");
        await manager.addLocalModules(modules);
        await expectDirectoryToMatchSnapshot(manager.root);

        gitSpy.mockRestore();
    });
});
