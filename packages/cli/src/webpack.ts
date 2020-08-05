import { Configuration, IgnorePlugin } from "webpack";
import { CliConfiguration } from "@replikit/cli/typings";
import WebpackBar from "webpackbar";
import { CompilerOptions } from "typescript";
import {
    MissingTSConfigurationField,
    ModulePathMappingNotFound,
    ProjectManager
} from "@replikit/cli";
import { resolve, isAbsolute } from "path";
import { Require } from "@replikit/core/typings";
import VirtualModulesPlugin from "webpack-virtual-modules";

export function createWebpackConfiguration(
    projectManager: ProjectManager,
    config: Require<CliConfiguration, "modules" | "outDir">,
    development = false
): Configuration {
    const tsconfig = config.tsconfig ?? "tsconfig.json";
    const fullConfigPath = resolve(projectManager.root, tsconfig);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const compilerOptions = require(fullConfigPath).compilerOptions as CompilerOptions;

    const { paths, baseUrl } = compilerOptions;

    if (!baseUrl) {
        throw new MissingTSConfigurationField("baseUrl");
    }

    if (!paths) {
        throw new MissingTSConfigurationField("paths");
    }

    const projectName = `@${projectManager.name}`;
    const mappings = paths[`${projectName}/*`];
    if (!mappings || !mappings.length) {
        throw new ModulePathMappingNotFound();
    }

    let mapping = mappings[0].replace("*/", "");
    if (!mapping.endsWith("/index.ts")) {
        mapping += "/index.ts";
    }

    const alias: Record<string, string> = {};
    const entry: Record<string, string> = { main: "./main.js" };
    for (const module of config.modules) {
        const moduleParts = module.slice(1).split("/");
        if (moduleParts.length < 2) {
            continue;
        }

        entry[`${moduleParts[0]}_${moduleParts[1]}`] = module;

        if (module.startsWith(projectName)) {
            const path = resolve(projectManager.root, baseUrl, moduleParts[1], mapping);
            alias[module] = path;
        }
    }

    const outputPath = isAbsolute(config.outDir)
        ? config.outDir
        : resolve(projectManager.root, config.outDir);

    // TODO prevent repeated config compilation
    const configManager = projectManager.getConfigManager();
    const compiledConfig = configManager.compile();

    const mainCode = [
        `async function main() {`,
        `await import("dotenv/config");`,
        `const { updateConfig, bootstrap, createScope } = await import("@replikit/core");`,
        compiledConfig,
        `const parseModules = env => env && env.split(",").map(x => x.trim());`,
        `const includedModules = parseModules(process.env.REPLIKIT_INCLUDED_MODULES);`,
        `const excludedModules = parseModules(process.env.REPLIKIT_EXCLUDED_MODULES);`,
        `const unrestricted = !includedModules && !excludedModules;`,
        `const logger = createScope("runtime");`,
        ...config.modules.map(x => {
            return [
                `(unrestricted`,
                `|| includedModules && includedModules.includes("${x}")`,
                `|| excludedModules && !excludedModules.includes("${x}"))`,
                `&& (logger.info("Loaded module ${x}"), await import("${x}"));`
            ].join(" ");
        }),
        `updateConfig(exports.default);`,
        `await bootstrap();`,
        `}`,
        `main();`
    ].join("\n");

    const result: Configuration = {
        entry,
        resolve: {
            alias,
            mainFields: ["main"],
            extensions: [".ts", ".js"]
        },
        optimization: { splitChunks: { chunks: "all" } },
        mode: development ? "development" : "production",
        devtool: development && "inline-cheap-source-map",
        target: "node",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "ts-loader",
                        options: { configFile: tsconfig, transpileOnly: true }
                    }
                },
                {
                    test: /\.node$/,
                    use: {
                        loader: "native-addon-loader",
                        options: { name: "addons/[name].[ext]" }
                    }
                }
            ]
        },
        plugins: [
            new IgnorePlugin(/@vk-io\/.*/),
            new WebpackBar({ name: "Replikit Build", color: "blue" }),
            new VirtualModulesPlugin({ "./main.js": mainCode })
        ],
        output: {
            path: outputPath,
            filename: chunkDate =>
                chunkDate.chunk.name === "main" ? "main.js" : "modules/[name].js",
            chunkFilename: "chunks/[chunkhash].js"
        }
    };
    return config.webpack ? config.webpack(result) : result;
}
