const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");
const { resolve } = require("path");

const root = resolve(__dirname, "packages");
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: [resolve(root, "test-utils/src/setup.ts")],
    moduleNameMapper: {
        "@replikit/(.*)/tests": root + "/$1/tests",
        ...pathsToModuleNameMapper(compilerOptions.paths, {
            prefix: root + "/"
        })
    },
    testRegex: `packages/.*/tests/.*\.test\.ts$`,
    watchPlugins: ["jest-watch-suspend"],
    moduleFileExtensions: ["js", "ts", "d.ts"],
    coverageDirectory: "./coverage/"
};
