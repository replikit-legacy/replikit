import { ShellController } from "@replikit/cli";

export class GitController extends ShellController {
    addSubmodule(url: string, folder: string): Promise<void> {
        return this.execute("git", ["submodule", "add", url, folder]);
    }
}
