import { ProjectManager, ModuleManager } from "@replikit/cli";

export async function createModule(
    manager: ProjectManager,
    name: string,
    modules: string[],
    addLogger: boolean
): Promise<ModuleManager> {
    const module = await manager.createModule(name);
    if (addLogger) {
        await module.addLogger();
    }
    await module.install(modules);
    return module;
}
