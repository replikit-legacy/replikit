import { ProjectManager, ModuleManager } from "@replikit/cli";

export async function createModule(
    manager: ProjectManager,
    name: string,
    addLogger: boolean
): Promise<ModuleManager> {
    const module = await manager.createModule(name);
    if (addLogger) {
        await module.addLogger();
    }
    return module;
}
