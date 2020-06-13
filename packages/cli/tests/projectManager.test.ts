import {
    setupTemp,
    createTempDirectory,
    expectDirectoryToMatchSnapshot
} from "@replikit/test-utils";
import { resolve } from "path";
import {
    ProjectManager,
    PMController,
    YarnController,
    NpmController,
    initProject,
    createModule
} from "@replikit/cli";

setupTemp();

jest.setTimeout(120000);

async function fakeInstall(
    this: PMController,
    modules: string[],
    dev?: boolean
): Promise<void> {
    for (const module of modules) {
        if (dev) {
            this.addDevDependencies({ [module]: "0.0.0" });
        } else {
            this.addDependencies({ [module]: "0.0.0" });
        }
    }
    await this.save();
}

async function createProject(
    useYarn: boolean,
    useLerna: boolean
): Promise<ProjectManager> {
    const temp = await createTempDirectory();
    const root = resolve(temp, "test-project");
    return await initProject(root, useLerna, useYarn, ["@replikit/static"]);
}

describe("ProjectManager", () => {
    const yarnMock = jest.spyOn(YarnController.prototype, "install");
    yarnMock.mockImplementation(fakeInstall);

    const npmMock = jest.spyOn(NpmController.prototype, "install");
    npmMock.mockImplementation(fakeInstall);

    it.each(["npm", "yarn", "yarn-lerna"])(
        "should generate %s project",
        async type => {
            const useYarn = type !== "npm";
            const useLerna = type !== "yarn";

            const manager = await createProject(useYarn, useLerna);
            await expectDirectoryToMatchSnapshot(manager.root);
        }
    );

    it.each(["with", "without"])(
        "should add a module to the project %s logger",
        async t => {
            const addLoger = t === "with";
            const manager = await createProject(false, false);
            await createModule(
                manager,
                "test-module",
                ["@replikit/test"],
                addLoger
            );
            await expectDirectoryToMatchSnapshot(manager.root);
        }
    );
});
