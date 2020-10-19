import execa from "execa";

export abstract class ShellController {
    constructor(protected readonly path: string) {}

    protected async execute(file: string, args?: string[], cwd?: string): Promise<void> {
        await execa(file, args, {
            cwd: cwd ?? this.path,
            stdout: "pipe",
            stderr: "pipe"
        });
    }
}
