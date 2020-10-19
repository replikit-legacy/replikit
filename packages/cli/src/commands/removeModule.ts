import {
    getProjectManager,
    logger,
    promptDeleteConfirmation,
    setupConfiguration
} from "@replikit/cli";
import { program } from "commander";

const command = program
    .command("remove-module")
    .arguments("<module>")
    .description("Remove module from the project")
    .option("-y, --yes", "Skip confirmation");
command.action(async (module, options) => {
    await setupConfiguration(options.config);
    const confirmed = await promptDeleteConfirmation(options.yes);
    if (!confirmed) {
        return;
    }
    const project = await getProjectManager();
    const removed = await project.removeModule(module);
    if (removed) {
        logger.info("Module removed successfully");
    } else {
        logger.error("Module not found");
    }
});
