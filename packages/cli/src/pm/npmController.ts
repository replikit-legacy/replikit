import { PMController, PMType } from "@replikit/cli";

export class NpmController extends PMController {
    readonly type = PMType.NPM;

    async install(modules: string[], dev?: boolean): Promise<void> {
        if (!modules.length) {
            return;
        }
        const args = ["install", "-S"];
        if (dev) {
            args.push("-D");
        }
        args.push(...modules);
        await this.execute("npm", args);
    }
}
