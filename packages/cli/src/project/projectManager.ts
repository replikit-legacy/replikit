import {
    ModuleManager,
    ConfigManager,
    logger,
    getConfigPath,
    PMController,
    PMType,
    createPMController,
    getPMController,
    GitController
} from "@replikit/cli";
import { resolve, basename, join } from "path";
import {
    writeFile,
    mkdir,
    writeJSON,
    pathExists,
    readJSON,
    readdir,
    ensureDir,
    readFile
} from "fs-extra";
import { PackageConfig } from "@replikit/cli/typings";
import parseGitConfig from "parse-git-config";

export class ProjectManager {
    readonly name: string;
    readonly externalPath: string;
    readonly git: GitController;

    private readonly configManager: ConfigManager;
    private pm: PMController;
    private configPath: string;

    constructor(readonly root: string, configManager?: ConfigManager) {
        this.configManager = configManager ?? new ConfigManager();
        this.name = basename(this.root);
        this.externalPath = join(this.root, "external");
        this.git = new GitController(root, this.externalPath);
    }

    private async saveConfig(): Promise<void> {
        await writeFile(this.configPath, this.configManager.serialize());
    }

    getConfigManager(): ConfigManager {
        return this.configManager;
    }

    /**
     * Sets the package manager type to use.
     */
    setPackageManager(type: PMType): void {
        this.pm = createPMController(type, this.root);
    }

    /**
     * Initializes a new project in the root directory.
     * Creates initial file structure and `package.json`.
     */
    async init(): Promise<void> {
        this.configManager.init();

        const exists = await pathExists(this.root);
        if (!exists) {
            await ensureDir(this.root);
        }

        // Create modules folder
        const modulesPath = resolve(this.root, "modules");
        await mkdir(modulesPath);

        // Create tsconfig
        const tsconfigPath = resolve(this.root, "tsconfig.json");
        const tsconfig = {
            compilerOptions: {
                target: "es2019",
                module: "commonjs",
                moduleResolution: "node",
                baseUrl: "modules",
                strict: true,
                paths: {
                    [`@${this.name}/*`]: ["*/src"],
                    [`@${this.name}/*/typings`]: ["*/typings"]
                }
            },
            include: ["replikit.config.ts", "modules/**/*.ts"]
        };
        await writeJSON(tsconfigPath, tsconfig, { spaces: 4 });

        // Init package
        this.pm.init(this.name, true);
        await this.pm.save();

        // Create replikit configuration
        this.configPath = resolve(this.root, "replikit.config.ts");
        await this.saveConfig();
    }

    /**
     * Adds lerna dependency and configuration to the project.
     */
    async addLerna(): Promise<void> {
        await this.pm.install(["lerna"], true);
        const lernaConfigPath = resolve(this.root, "lerna.json");
        const isYarn = this.pm.type === PMType.Yarn;
        const props = isYarn ? { npmClient: "yarn", useWorkspaces: true } : { npmClient: "npm" };
        const lernaConfig = {
            version: "0.0.0",
            ...props
        };
        await writeJSON(lernaConfigPath, lernaConfig, { spaces: 4 });
    }

    /**
     * Updates tsconfig paths to use modules from external repo.
     */
    async addExternalRepo(path: string): Promise<void> {
        const fullPath = join(this.externalPath, path);
        const packageJsonPath = join(fullPath, "package.json");
        const packageJson: PackageConfig = await readJSON(packageJsonPath);
        const tsconfigPath = resolve(this.root, "tsconfig.json");
        const tsconfig = await readJSON(tsconfigPath);
        tsconfig.compilerOptions.paths = {
            ...tsconfig.compilerOptions.paths,
            [`@${packageJson.name}/*`]: [`../external/${path}/modules/*/src`],
            [`@${packageJson.name}/*/typings`]: [`../external/${path}/modules/*/typings`]
        };
        await writeJSON(tsconfigPath, tsconfig, { spaces: 4 });

        await this.pm.load();

        // Add pm workspaces

        if (this.pm.config.workspaces) {
            this.pm.config.workspaces.push(`external/${path}`);
            this.pm.config.workspaces.push(`external/${path}/modules/*`);
        }

        const lernaConfigPath = join(this.root, "lerna.json");
        if (await pathExists(lernaConfigPath)) {
            const lernaConfig = await readJSON(lernaConfigPath);
            if (!lernaConfig.packages) {
                lernaConfig.packages = [];
            }
            lernaConfig.packages.push(`external/${path}`);
            lernaConfig.packages.push(`external/${path}/modules/*`);
        }

        await this.pm.save();
        await this.pm.install();
    }

    /**
     * Recursively resolves dependencies of the external repository.
     */
    async resolveExternalDependencies(path: string): Promise<void> {
        logger.debug(`Resolving dependencies of module ${path}`);

        interface ModulesConfig {
            submodule: Record<string, { path: string; url: string }>;
        }

        const externalPath = join(this.externalPath, path);

        const modulesConfigPath = join(externalPath, ".gitmodules");
        const modulesConfigExists = await pathExists(modulesConfigPath);
        if (!modulesConfigExists) {
            logger.trace(`Git modules config not found: ${modulesConfigPath}`);
            return;
        }

        const replikitConfigPath = join(externalPath, "replikit.config.ts");
        const replikitConfigExists = await pathExists(replikitConfigPath);
        if (!replikitConfigExists) {
            logger.trace(
                `Submodule ${path} does not contain replikit.config.ts: ${replikitConfigPath}`
            );
            return;
        }

        const configManager = new ConfigManager();
        const configContent = await readFile(replikitConfigPath, "utf8");
        configManager.load(configContent);

        const gitConfig = await parseGitConfig({ path: modulesConfigPath, expandKeys: true });
        const modulesConfig = gitConfig as ModulesConfig;

        if (!modulesConfig || !modulesConfig.submodule) {
            logger.trace("Git modules config does not contain submodule section");
            return;
        }

        for (const submodule of Object.values(modulesConfig.submodule)) {
            logger.trace(`Checking dependency ${submodule.path}`);
            const repositoryName = submodule.path.split("/")[1];

            const submoduleModules = configManager
                .getModules()
                .filter(x => x.startsWith(`@${repositoryName}`));

            if (!submoduleModules.length) {
                logger.trace(
                    `Config contains no imported modules from submodule ${submodule.path}`
                );
                return;
            }

            logger.info(`Adding submodule ${repositoryName} as dependency of ${path}`);
            await this.git.addSubmodule(submodule.url, repositoryName);
            await this.addExternalRepo(repositoryName);
            await this.addLocalModules(submoduleModules);
            await this.resolveExternalDependencies(repositoryName);
        }
    }

    /**
     * Gets names of all modules in the external repo.
     */
    async getExternalModuleNames(path: string): Promise<string[]> {
        const repoPath = join(this.externalPath, path);
        const packageJsonPath = join(repoPath, "package.json");
        const packageJson: PackageConfig = await readJSON(packageJsonPath);
        const modulesPath = join(repoPath, "modules");
        const moduleNames = await readdir(modulesPath);
        return moduleNames.map(x => `@${packageJson.name}/${x}`);
    }

    /**
     * Loads an existing project from the root directory.
     */
    async load(): Promise<void> {
        this.configPath = getConfigPath();
        logger.debug("Loading project " + this.root);

        this.pm = await getPMController(this.root);
        await this.pm.load();
    }

    /**
     * Creates a new module and adds it to the configuration.
     */
    async createModule(name: string): Promise<ModuleManager> {
        const module = this.getModule(name);
        await module.init();
        if (!this.configManager.checkModule(module.fullName)) {
            this.configManager.addModule(module.fullName);
            await this.saveConfig();
        }
        return module;
    }

    /**
     * Deletes the module and removes it from the configuration.
     * Returns `false` if module was not found.
     */
    async removeModule(name: string): Promise<boolean> {
        const module = this.getModule(name);
        const ok = await module.remove();
        if (!ok) {
            return false;
        }
        if (this.configManager.checkModule(module.fullName)) {
            this.configManager.removeModule(module.fullName);
            await this.saveConfig();
        }
        return true;
    }

    /**
     * Removes external repository and its modules.
     */
    async removeExternalRepository(repository: string): Promise<void> {
        const modules = await this.getExternalModuleNames(repository);
        for (const module of modules) {
            this.configManager.removeModule(module);
        }
        await this.saveConfig();
        await this.git.removeSubmodule(repository);
    }

    /**
     * Installs dependencies to the project.
     */
    async install(modules: string[], dev?: boolean): Promise<void> {
        await this.pm.install(modules, dev);
    }

    /**
     * Adds already installed modules to the project and updates config.
     */
    async addLocalModules(modules: string[]): Promise<void> {
        for (const module of modules) {
            this.configManager.addModule(module);
        }
        await this.saveConfig();
    }

    /**
     * Adds modules to the project and updates config.
     */
    async addModules(modules: string[], dev?: boolean): Promise<void> {
        await this.install(modules, dev);
        await this.addLocalModules(modules);
    }

    /**
     * Returns a `ModuleManager` for the module with specified name.
     */
    getModule(name: string): ModuleManager {
        return new ModuleManager(this, name, this.pm.type);
    }
}
