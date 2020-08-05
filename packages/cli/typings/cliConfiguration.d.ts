import { Configuration } from "webpack";

export interface CliConfiguration {
    projectRoot?: string;
    outDir?: string;
    modules?: string[];
    tsconfig?: string;
    webpack?: (config: Configuration) => Configuration;
}
