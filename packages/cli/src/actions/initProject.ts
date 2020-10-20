import { ProjectManager, PMType, availableStaticModules } from "@replikit/cli";
import { pathExists, writeFile } from "fs-extra";
import { join } from "path";

export async function initProject(
    root: string,
    useLerna: boolean,
    useYarn: boolean,
    initGit: boolean,
    modules: string[]
): Promise<ProjectManager> {
    const projectManager = new ProjectManager(root);
    const type = useYarn ? PMType.Yarn : PMType.NPM;
    projectManager.setPackageManager(type);
    await projectManager.init();
    if (initGit) {
        const gitIgnorePath = join(projectManager.root, ".gitignore");
        const gitIgnoreExists = await pathExists(gitIgnorePath);
        if (!gitIgnoreExists) {
            await writeFile(gitIgnorePath, "node_modules\ndist");
        }
    }
    await projectManager.install(modules);
    const staticModules = modules.filter(x => availableStaticModules.includes(x));
    await projectManager.addLocalModules(staticModules);
    await projectManager.install(["@types/node", "@replikit/cli"], true);
    if (useLerna) {
        await projectManager.addLerna();
    }
    return projectManager;
}
