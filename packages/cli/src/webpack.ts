import { Configuration, IgnorePlugin } from "webpack";
import WebpackBar from "webpackbar";
import { CompilerOptions } from "typescript";
import { MissingTSConfigurationField, ProjectManager } from "@replikit/cli";
import { resolve, isAbsolute } from "path";
import VirtualModulesPlugin from "webpack-virtual-modules";
import { CliConfiguration } from "@replikit/cli/typings";
import TerserPlugin from "terser-webpack-plugin";

function normalizeMappingPath(path: string): string {
    return path.endsWith("/index.ts") ? path : `${path}/index.ts`;
}

export function createWebpackConfiguration(
    projectManager: ProjectManager,
    config: CliConfiguration,
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

    const mappings = Object.keys(paths)
        .filter(x => /^@\S*\/\*$/gm.test(x))
        .map(x => ({
            namespace: x.split("/")[0].slice(1),
            path: normalizeMappingPath(paths[x][0])
        }));

    const alias: Record<string, string> = {};
    const entry: Record<string, string> = { main: "./main.js" };
    const modules = config.modules ?? [];
    for (const module of modules) {
        const moduleParts = module.slice(1).split("/");
        if (moduleParts.length < 2) {
            continue;
        }

        entry[`${moduleParts[0]}_${moduleParts[1]}`] = module;

        const mapping = mappings.find(x => x.namespace === moduleParts[0]);
        if (mapping) {
            alias[module] = resolve(
                projectManager.root,
                baseUrl,
                mapping.path.replace("*", moduleParts[1])
            );
        }
    }

    const outDir = config.outDir ?? "./dist";
    const outputPath = isAbsolute(outDir) ? config.outDir : resolve(projectManager.root, outDir);

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
        ...modules.map(x => {
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
            extensions: [".ts", ".js", ".json"]
        },
        optimization: {
            splitChunks: {
                chunks: "all",
                minSize: 0,
                maxAsyncRequests: Infinity,
                maxInitialRequests: Infinity
            }
        },
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
                        options: { name: "addons/[name].[ext]", from: "chunks" }
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
            chunkFilename: "chunks/[chunkhash].js",
            libraryTarget: "commonjs2"
        }
    };

    // Disable some optimizations to allow discord controller bundling
    if (modules.includes("@replikit/discord")) {
        result.externals = ["@discordjs/opus", "node-opus", "opusscript", "ffmpeg-static"];
        result.optimization!.minimizer = [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
                terserOptions: {
                    keep_classnames: true
                }
            })
        ];
    }

    return config.webpack ? config.webpack(result) : result;
}
