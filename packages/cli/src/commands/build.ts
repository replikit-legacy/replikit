import { program } from "commander";
import {
    loadConfiguration,
    createWebpackConfiguration,
    getProjectManager,
    logger
} from "@replikit/cli";
import { updateConfig, config } from "@replikit/core";
import webpack from "webpack";
import { inspect } from "util";
import { remove, pathExists } from "fs-extra";
import { CliConfiguration } from "@replikit/cli/typings";

const command = program
    .command("build")
    .option("--print-config")
    .option("--development")
    .description("Build all modules to production-ready bundle");
command.action(async options => {
    const newConfig = await loadConfiguration(options.config);
    updateConfig(newConfig);

    const projectManager = await getProjectManager();
    const webpackConfig = createWebpackConfiguration(
        projectManager,
        config.cli as CliConfiguration,
        options.development
    );

    if (options.printConfig) {
        const message = inspect(webpackConfig, {
            showHidden: false,
            depth: null,
            colors: true
        });
        return console.log(message);
    }

    if (await pathExists(webpackConfig.output!.path!)) {
        await remove(webpackConfig.output!.path!);
    }

    webpack(webpackConfig, (error, stats) => {
        if (error) {
            return logger.error("Error while webpack compilation", error);
        }

        const message = stats.toString({
            errors: true,
            colors: true,
            all: false,
            assets: true,
            hash: true,
            version: true,
            builtAt: true
        });
        console.log(message.replace(/\[32m/gm, "[34m"));
    });
});
