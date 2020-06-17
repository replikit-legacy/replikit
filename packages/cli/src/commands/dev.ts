import { program } from "commander";
import execa from "execa";
import { resolve } from "path";

const command = program
    .command("dev")
    .description("Start in dev mode")
    .option(
        "--inspect-brk <port>",
        "Enable NodeJS debugger with specified port"
    );
command.action(async options => {
    const tsndPath = require.resolve("ts-node-dev/bin/ts-node-dev");
    const workerPath = resolve(__dirname, "../worker/dev.js");
    const args = [
        "--respawn",
        "--clear",
        "--no-notify",
        "--files",
        "--exit-child",
        // "--transpile-only",
        "--watch",
        "replikit.config.ts"
    ];
    if (options.inspectBrk) {
        args.push(`--inspect-brk=${options.inspectBrk}`);
    }
    args.push("--", workerPath);
    if (options.config) {
        args.push(options.config);
    }
    await execa(tsndPath, args, {
        stdin: process.stdin,
        stdout: process.stdout,
        stderr: process.stderr
    });
});
