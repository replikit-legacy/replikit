import {
    getProjectManager,
    validateDirectoryName,
    createModule,
    logger,
    setupConfiguration
} from "@replikit/cli";
import { program } from "commander";
import { prompt } from "inquirer";

const command = program.command("create-module").description("Create a new module");
command.action(async options => {
    await setupConfiguration(options.config);
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
        }
    ]);
    const manager = await getProjectManager();
    try {
        await createModule(manager, result.moduleName, result.addLogger);
        logger.info("Module created successfuly");
    } catch (e) {
        logger.fatal("Error while creating the module", e);
    }
});
