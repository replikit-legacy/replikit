import { program } from "commander";

program
    .name("replikit")
    .helpOption("-h, --help", "Display help for command")
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .version(require("../package.json").version, "-v, --version", "Output the version number")
    .option("-c, --config", "Config file to use")
    .option("-V, --verbose", "Enable verbose logging");
