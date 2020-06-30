import execa from "execa";
import { YarnController, NpmController, PMController, PMType } from "@replikit/cli";
import { readJSON } from "fs-extra";
import { resolve } from "path";
import { PackageConfig } from "@replikit/cli/typings";

export async function detectYarn(): Promise<boolean> {
    try {
        await execa("yarn", ["--version"]);
        return true;
    } catch (e) {
        return false;
    }
}

export function createPMController(type: PMType, path: string): PMController {
    switch (type) {
        case PMType.NPM:
            return new NpmController(path);
        case PMType.Yarn:
            return new YarnController(path);
    }
}

export async function getPMController(path: string): Promise<PMController> {
    const json: PackageConfig = await readJSON(resolve(path, "package.json"));
    const type = json.workspaces ? PMType.Yarn : PMType.NPM;
    const controller = createPMController(type, path);
    controller.config = json;
    return controller;
}
