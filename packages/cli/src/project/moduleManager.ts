import { pathExists, mkdir } from "fs-extra";
import { PMController, PMType, createPMController, ProjectManager } from "@replikit/cli";
import { Project } from "ts-morph";
import { resolve } from "path";

export class ModuleManager {
    readonly root: string;
    private readonly pm: PMController;
    private project: Project;

    constructor(readonly parent: ProjectManager, readonly name: string, type: PMType) {
        this.root = resolve(parent.root, "modules", name);
        this.pm = createPMController(type, this.root);
    }

    /**
     * Loads an existing module from the root directory.
     */
    async load(): Promise<void> {
        const exists = await pathExists(this.root);
        if (!exists) {
            throw new Error("Module not found");
        }

        this.loadProject();
    }

    /**
     * Initializes a new module in the root directory.
     */
    async init(): Promise<void> {
        const exists = await pathExists(this.root);
        if (exists) {
            throw new Error("Module already exists");
        }

        // Create module folder
        await mkdir(this.root);

        // Init package
        this.pm.init(this.fullName);
        await this.pm.save();

        // Load project
        this.loadProject();

        // Create basic file structure
        const indexPath = resolve(this.root, "src/index.ts");
        this.project.createSourceFile(indexPath);

        await this.project.save();
    }

    /**
     * Adds a logger in the module.
     * Creates `startup.ts` file.
     */
    async addLogger(): Promise<void> {
        const startupPath = resolve(this.root, "src/startup.ts");
        const startupFile = this.project.createSourceFile(startupPath);
        const exportDeclaration = `/** @internal */\nexport const logger = createScope("${this.name}");`;
        startupFile.addImportDeclaration({
            namedImports: ["createScope"],
            moduleSpecifier: "@replikit/core",
            trailingTrivia: writer => writer.blankLine().writeLine(exportDeclaration)
        });

        const indexPath = resolve(this.root, "src/index.ts");
        const indexFile = this.project.getSourceFile(indexPath);

        if (!indexFile) {
            throw new Error("Unable to add a logger to uninitialized project");
        }

        indexFile.addExportDeclaration({ moduleSpecifier: "./startup" });

        await this.project.save();
    }

    get fullName(): string {
        return `@${this.parent.name}/${this.name}`;
    }

    /**
     * Installs dependencies to the module.
     */
    async install(modules: string[], dev?: boolean): Promise<void> {
        await this.pm.install(modules, dev);
    }

    private loadProject(): void {
        this.project = new Project({
            tsConfigFilePath: resolve(this.root, "../../tsconfig.json"),
            compilerOptions: {
                outDir: resolve(this.root, "dist"),
                paths: { [this.pm.config.name]: [this.name + "/src"] }
            }
        });
    }
}
