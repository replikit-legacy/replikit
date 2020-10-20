import { program } from "commander";
import {
    setupConfiguration,
    getProjectManager,
    createExternalProjectName,
    logger,
    validateDirectoryName
} from "@replikit/cli";
import { prompt } from "inquirer";
import { pathExists, ensureDir } from "fs-extra";
import { join } from "path";

interface FirstPromptResult {
    url: string;
    name: string;
}

interface SecondPromptResult {
    modules: string[];
}

interface AdditionalPromptResult {
    postfix: string;
}

const command = program
    .command("add-external")
    .description("Add an external repository with Replikit modules");
command.action(async options => {
    await setupConfiguration(options.config);
    const project = await getProjectManager();
    const firstResult = await prompt<FirstPromptResult>([
        {
            type: "input",
            name: "url",
            message: "Repository url"
        },
        {
            type: "input",
            name: "name",
            message: "Name",
            default: (result: FirstPromptResult) => createExternalProjectName(result.url),
            validate: validateDirectoryName
        }
    ]);
    try {
        await ensureDir(project.externalPath);
        await project.git.addSubmodule(firstResult.url, firstResult.name);
    } catch (e) {
        logger.fatal("Error while adding the external repository", e);
    }
    let path = firstResult.name;
    const modulesPath = join(project.externalPath, firstResult.name, "modules");
    const modulesPathExists = await pathExists(modulesPath);
    if (!modulesPathExists) {
        const additionalResult = await prompt<AdditionalPromptResult>({
            type: "input",
            name: "postfix",
            message: "Relative path to Replikit root directory in the repository",
            validate: async (input: string) => {
                const modulesPath = join(project.externalPath, firstResult.name, input, "modules");
                const modulesPathExists = await pathExists(modulesPath);
                return modulesPathExists || 'Specified directory doesn\'t contain "modules"';
            }
        });
        path = join(firstResult.name, additionalResult.postfix);
    }
    try {
        await project.addExternalRepo(path);
        const allModules = await project.getExternalModuleNames(path);
        logger.info("Repository submodule added");
        const secondResult = await prompt<SecondPromptResult>([
            {
                type: "checkbox",
                name: "modules",
                message: "External modules",
                choices: allModules,
                validate: (input: string[]) => !!input.length || "No modules selected"
            }
        ]);
        await project.addLocalModules(secondResult.modules);
        await project.resolveExternalDependencies(path);
        logger.info("External modules added successfuly");
    } catch (e) {
        logger.fatal("Error while adding the external repository", e);
    }
});
