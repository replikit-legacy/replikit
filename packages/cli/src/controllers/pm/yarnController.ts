import { PMController, PMType } from "@replikit/cli";

export class YarnController extends PMController {
    readonly type = PMType.Yarn;

    init(name: string, isRoot?: boolean): void {
        super.init(name, isRoot);
        if (isRoot) {
            this.config.workspaces = ["modules/*"];
        }
    }

    private get isRoot(): boolean {
        return this.config.workspaces !== undefined;
    }

    async install(modules: string[] = [], dev?: boolean): Promise<void> {
        const args = [];
        if (modules.length) {
            args.push("add");
        }
        if (dev) {
            args.push("-D");
        }
        if (this.isRoot) {
            args.push("-W");
        }
        args.push(...modules);
        await this.execute("yarn", args);
    }
}
