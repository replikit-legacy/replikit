import execa from "execa";

export abstract class ShellController {
    constructor(protected readonly path: string) {}

    protected async execute(file: string, args?: string[]): Promise<void> {
        await execa(file, args, {
            cwd: this.path,
            stdout: "pipe",
            stderr: "pipe"
        });
    }
}
