import {
    ModuleManager,
    ConfigManager,
    logger,
    getConfigPath,
    PMController,
    PMType,
    createPMController,
    getPMController
} from "@replikit/cli";
import { resolve, basename } from "path";
import { writeFile, mkdir, writeJSON, pathExists, readJSON } from "fs-extra";

export class ProjectManager {
    readonly name: string;

    private readonly configManager: ConfigManager;
    private pm: PMController;
    private configPath: string;

    constructor(readonly root: string, configManager?: ConfigManager) {
        this.configManager = configManager ?? new ConfigManager();
        this.name = basename(this.root);
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
            await mkdir(this.root);
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
     * Add hook plugin and ts-patch dependency.
     */
    async addHooks(): Promise<void> {
        // Add hook plugin
        const tsconfigPath = resolve(this.root, "tsconfig.json");
        const tsconfig = await readJSON(tsconfigPath);
        tsconfig.compilerOptions.plugins = [{ transform: "@replikit/hooks/plugin" }];
        await writeJSON(tsconfigPath, tsconfig, { spaces: 4 });

        // Add ts-patch
        await this.pm.install(["ts-patch"], true);
        this.pm.config.scripts!.postinstall = "ts-patch install -s";
        await this.pm.save();
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
     * Installs dependencies to the project.
     */
    async install(modules: string[], dev?: boolean): Promise<void> {
        await this.pm.install(modules, dev);
    }

    /**
     * Adds modules to the project and updates config.
     */
    async addModules(modules: string[], dev?: boolean): Promise<void> {
        await this.install(modules, dev);
        for (const module of modules) {
            this.configManager.addModule(module);
        }
        await this.saveConfig();
    }

    /**
     * Returns a `ModuleManager` for the module with specified name.
     */
    getModule(name: string): ModuleManager {
        return new ModuleManager(this, name, this.pm.type);
    }
}
