import {
    getProjectManager,
    loadConfiguration,
    validateDirectoryName,
    availableModules,
    createModule,
    logger
} from "@replikit/cli";
import { program } from "commander";
import { prompt } from "inquirer";
import { updateConfig } from "@replikit/core";

const command = program
    .command("create-module")
    .description("Create a new module");
command.action(async options => {
    const config = await loadConfiguration(options.config);
    updateConfig(config);
    const result = await prompt([
        {
            type: "input",
            name: "moduleName",
            message: "Module name",
            validate: validateDirectoryName
        },
        {
            type: "confirm",
            name: "addLogger",
            message: "Do you want to add a logger to the module?"
        },
        {
            type: "checkbox",
            name: "modules",
            message: "Modules",
            choices: availableModules
        }
    ]);
    const manager = await getProjectManager();
    try {
        await createModule(
            manager,
            result.moduleName,
            result.modules,
            result.addLogger
        );
        logger.info("Module created successfuly");
    } catch (e) {
        logger.fatal("Error while creating the module", e);
    }
});
