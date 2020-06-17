import {
    detectYarn,
    checkFolderIsEmpty,
    validateDirectoryName,
    logger,
    initProject,
    availableStaticModules,
    availableModules,
    createModule
} from "@replikit/cli";
import { prompt } from "inquirer";
import { pathExists } from "fs-extra";
import { resolve } from "path";
import { program } from "commander";

interface PromptResult {
    projectName: string;
    useYarn: boolean;
    useLerna: boolean;
    staticModules: string[];
    createModule: boolean;
    moduleName: string;
    addLogger: boolean;
    modules: string[];
}

const command = program.command("init").description("Create a new project");
command.action(async () => {
    const yarnExists = await detectYarn();
    const cwd = process.cwd();
    const isEmpty = await checkFolderIsEmpty(cwd);
    const result = await prompt<PromptResult>([
        {
            type: "input",
            message: "Project name",
            name: "projectName",
            when: !isEmpty,
            validate: async (path): Promise<true | string> => {
                const message = validateDirectoryName(path);
                if (message !== true) {
                    return message;
                }
                const exists = await pathExists(resolve(cwd, path));
                return !exists || "Item with the same name already exists";
            }
        },
        {
            type: "confirm",
            name: "useYarn",
            default: true,
            message: "Do you want to use Yarn?",
            when: yarnExists
        },
        {
            type: "confirm",
            name: "useLerna",
            default: false,
            message: "Do you want to use Lerna in addition to Yarn?",
            when: (result): boolean => result.useYarn
        },
        {
            type: "checkbox",
            name: "staticModules",
            message: "Static modules",
            choices: availableStaticModules
        },
        {
            type: "confirm",
            name: "createModule",
            message: "Do you want to create a new module?",
            default: true
        },
        {
            type: "input",
            name: "moduleName",
            message: "Module name",
            validate: validateDirectoryName,
            when: (result): boolean => result.createModule
        },
        {
            type: "confirm",
            name: "addLogger",
            message: "Do you want to add a logger to the module?",
            when: (result): boolean => result.createModule
        },
        {
            type: "checkbox",
            name: "modules",
            message: "Modules",
            choices: availableModules,
            when: (result): boolean => result.createModule
        }
    ]);
    const root = isEmpty ? cwd : resolve(cwd, result.projectName);
    const useLerna = !result.useYarn || result.useLerna;
    try {
        const manager = await initProject(
            root,
            useLerna,
            result.useYarn,
            result.staticModules
        );
        if (result.createModule) {
            await createModule(
                manager,
                result.moduleName,
                result.modules,
                result.addLogger
            );
        }
        logger.info("Project created successfuly");
    } catch (e) {
        logger.fatal("Error while creating the project", e);
    }
});
