import { PMController, PMType } from "@replikit/cli";

export class NpmController extends PMController {
    readonly type = PMType.NPM;

    async install(modules: string[] = [], dev?: boolean): Promise<void> {
        const args = ["install"];
        if (modules.length) {
            args.push("-S");
        }
        if (dev) {
            args.push("-D");
        }
        args.push(...modules);
        await this.execute("npm", args);
    }
}
