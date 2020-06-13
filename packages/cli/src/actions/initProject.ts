import { ProjectManager, PMType } from "@replikit/cli";

export async function initProject(
    root: string,
    useLerna: boolean,
    useYarn: boolean,
    staticModules: string[]
): Promise<ProjectManager> {
    const projectManager = new ProjectManager(root);
    const type = useYarn ? PMType.Yarn : PMType.NPM;
    projectManager.setPackageManager(type);
    await projectManager.init();
    await projectManager.addModules(staticModules);
    await projectManager.install(["replikit"], true);
    if (useLerna) {
        await projectManager.addLerna();
    }
    return projectManager;
}
