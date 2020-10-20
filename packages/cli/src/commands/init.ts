import {
    detectYarn,
    validateDirectoryName,
    logger,
    initProject,
    createModule,
    getFolderState,
    FolderState,
    availableModules
} from "@replikit/cli";
import { prompt } from "inquirer";
import { pathExists } from "fs-extra";
import { resolve } from "path";
import { program } from "commander";

interface PromptResult {
    projectName: string;
    useYarn: boolean;
    useLerna: boolean;
    modules: string[];
    createModule: boolean;
    moduleName: string;
    addLogger: boolean;
    initGit: boolean;
}

const command = program.command("init").description("Create a new project");
command.action(async () => {
    const yarnExists = await detectYarn();
    const cwd = process.cwd();
    const folderState = await getFolderState(cwd);
    const result = await prompt<PromptResult>([
        {
            type: "input",
            message: "Project name",
            name: "projectName",
            when: folderState === FolderState.HasContent,
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
            type: "confirm",
            name: "initGit",
            default: true,
            message: "Do you want to initialize a git repository?",
            when: folderState !== FolderState.HasGit
        },
        {
            type: "checkbox",
            name: "modules",
            message: "Modules to install",
            choices: availableModules
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
        }
    ]);
    const root = folderState !== FolderState.HasContent ? cwd : resolve(cwd, result.projectName);
    const useLerna = !result.useYarn || result.useLerna;
    try {
        const manager = await initProject(
            root,
            useLerna,
            result.useYarn,
            result.initGit,
            result.modules
        );
        if (result.createModule) {
            await createModule(manager, result.moduleName, result.addLogger);
        }
        logger.info("Project created successfuly");
    } catch (e) {
        logger.fatal("Error while creating the project", e);
    }
});
