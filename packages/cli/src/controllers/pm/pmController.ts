import execa from "execa";
import { PackageConfig } from "@replikit/cli/typings";
import { deepmerge } from "@replikit/core";
import { writeJSON, readJSON } from "fs-extra";
import { resolve } from "path";
import { PMType, ShellController } from "@replikit/cli";

export abstract class PMController extends ShellController {
    abstract readonly type: PMType;

    private readonly configPath: string;
    config: PackageConfig;

    constructor(path: string) {
        super(path);
        this.configPath = resolve(this.path, "package.json");
    }

    async load(): Promise<void> {
        this.config = await readJSON(this.configPath);
    }

    async save(): Promise<void> {
        await writeJSON(this.configPath, this.config, { spaces: 4 });
    }

    init(name: string, isRoot?: boolean): void {
        this.config = {
            name,
            version: "0.0.0",
            license: "MIT"
        };
        if (isRoot) {
            this.config.private = true;
            this.config.scripts = {
                dev: "replikit dev",
                build: "replikit build"
            };
        }
    }

    addDevDependencies(devDependencies: Record<string, string>): void {
        if (!this.config.devDependencies) {
            this.config.devDependencies = devDependencies;
        } else {
            deepmerge(this.config.devDependencies, devDependencies);
        }
    }

    addDependencies(dependencies: Record<string, string>): void {
        if (!this.config.dependencies) {
            this.config.dependencies = dependencies;
        } else {
            deepmerge(this.config.dependencies, dependencies);
        }
    }

    abstract install(modules?: string[], dev?: boolean | undefined): Promise<void>;

    protected async execute(file: string, args?: string[]): Promise<void> {
        await execa(file, args, {
            cwd: this.path,
            stdout: process.stdout,
            stderr: process.stderr
        });
    }
}
