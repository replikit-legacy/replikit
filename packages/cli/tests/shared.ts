import { createTempDirectory } from "@replikit/test-utils";
import { resolve } from "path";
import {
    initProject,
    ProjectManager,
    YarnController,
    NpmController,
    PMController
} from "@replikit/cli";

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

const yarnMock = jest.spyOn(YarnController.prototype, "install");
yarnMock.mockImplementation(fakeInstall);

const npmMock = jest.spyOn(NpmController.prototype, "install");
npmMock.mockImplementation(fakeInstall);

export async function createProject(
    useYarn: boolean,
    useLerna: boolean
): Promise<ProjectManager> {
    const temp = await createTempDirectory();
    const root = resolve(temp, "test-project");
    return await initProject(root, useLerna, useYarn, ["@replikit/static"]);
}
