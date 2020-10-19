import {
    getProjectManager,
    logger,
    promptDeleteConfirmation,
    setupConfiguration
} from "@replikit/cli";
import { program } from "commander";

const command = program
    .command("remove-external")
    .arguments("<repository>")
    .description("Remove external repository from the project")
    .option("-y, --yes", "Skip confirmation");
command.action(async (repository, options) => {
    await setupConfiguration(options.config);
    const confirmed = await promptDeleteConfirmation(options.yes);
    if (!confirmed) {
        return;
    }
    const project = await getProjectManager();
    await project.removeExternalRepository(repository);
    logger.info("External repository removed successfully");
});
