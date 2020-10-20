import { config, updateConfig } from "@replikit/core";
import { resolve } from "path";
import { logger, ProjectManager, ConfigManager } from "@replikit/cli";
import { readdir, pathExists, readFile } from "fs-extra";
import requireFromString from "require-from-string";
import { Configuration } from "@replikit/core/typings";
import { prompt } from "inquirer";
import { program } from "commander";

const configFiles = ["replikit.config.ts", "replikit.config.js"];

async function findConfigPath(): Promise<string> {
    for (const file of configFiles) {
        const fullPath = resolve(process.cwd(), file);
        if (await pathExists(fullPath)) {
            return fullPath;
        }
    }
    return logger.fatal("Config file not found");
}

async function resolveConfigPath(file?: string): Promise<string> {
    if (file) {
        const exists = await pathExists(file);
        if (!exists) {
            logger.fatal("Specified file does not exist");
        }
        return file;
    }
    return await findConfigPath();
}

let configPath: string;
let configManager: ConfigManager;

export function getConfigPath(): string {
    return configPath;
}

export async function loadConfiguration(file?: string): Promise<Configuration> {
    configPath = await resolveConfigPath(file);
    configManager = new ConfigManager();
    try {
        const content = await readFile(configPath, "utf8");
        configManager.load(content);
        const compiled = configManager.compile();
        const module = requireFromString(compiled);
        if (module.default) {
            if (module.modules) {
                config.cli.modules.push(...module.modules);
            }
            return module.default as Configuration;
        }
        return logger.fatal("Configuration file does not provide default export");
    } catch (e) {
        return logger.fatal("Cannot load the configuration", e);
    }
}

export async function setupConfiguration(file?: string): Promise<void> {
    const config = await loadConfiguration(file);
    if (program.opts().verbose) {
        if (!config.core) {
            config.core = {};
        }
        config.core.logLevel = "verbose";
    }
    updateConfig(config);
}

export enum FolderState {
    Empty,
    HasGit,
    HasContent
}

export async function getFolderState(path: string): Promise<FolderState> {
    const items = await readdir(path);
    if (items.length === 0) {
        return FolderState.Empty;
    }
    if (items.length === 1 && items[0] === ".git") {
        return FolderState.HasGit;
    }
    return FolderState.HasContent;
}

export function validateDirectoryName(name: string): true | string {
    const regex = /^[-\w^&'@{}[\],$=!#().%+~; ]+$/;
    return regex.test(name) || "Invalid directory name";
}

export async function getProjectManager(): Promise<ProjectManager> {
    const root = config.cli.projectRoot ?? process.cwd();
    const manager = new ProjectManager(root, configManager);
    await manager.load();
    return manager;
}

export function createExternalProjectName(url: string): string {
    const segments = url.split("/");
    const last = segments[segments.length - 1];
    return last.endsWith(".git") ? last.slice(0, -4) : last;
}

export async function promptDeleteConfirmation(skip: boolean): Promise<boolean> {
    const { confirmation } = await prompt({
        name: "confirmation",
        type: "confirm",
        message: "After this operation, the module will be permanently deleted. Are you sure?",
        when: !skip,
        default: false
    });
    return (skip || confirmation) as boolean;
}
