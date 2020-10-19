import { ShellController } from "@replikit/cli";
import { readFile, remove } from "fs-extra";
import { join } from "path";

export class GitController extends ShellController {
    constructor(readonly root: string, readonly externalPath: string) {
        super(root);
    }

    addSubmodule(url: string, folder: string): Promise<void> {
        return this.execute("git", ["submodule", "add", url, folder], this.externalPath);
    }

    async removeSubmodule(name: string): Promise<void> {
        const folder = `external/${name}`;
        await this.execute("git", ["submodule", "deinit", "-f", folder]);
        await this.execute("git", ["rm", "--cached", folder]);
        await this.execute("git", [
            "config",
            "-f",
            ".gitmodules",
            "--remove-section",
            `submodule.${folder}`
        ]);
        await remove(join(this.root, ".git/modules", folder));
        await remove(join(this.root, folder));

        // Remove .gitmodules if empty
        const gitModulesPath = join(this.root, ".gitmodules");
        const content = await readFile(gitModulesPath, "utf8");
        if (!content.length) {
            await remove(gitModulesPath);
        }
    }
}
