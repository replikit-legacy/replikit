import { config } from "@replikit/core";
import { resolve } from "path";
import { logger, ProjectManager, ConfigManager } from "@replikit/cli";
import { readdir, pathExists, readFile } from "fs-extra";
import requireFromString from "require-from-string";
import { Configuration } from "@replikit/core/typings";

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

export async function checkFolderIsEmpty(path: string): Promise<boolean> {
    const items = await readdir(path);
    return items.length === 0;
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
