require("dotenv/config");
require("tsconfig-paths/register");

import { loadConfiguration, logger } from "@replikit/cli";
import { bootstrap, config } from "@replikit/core";

async function main(): Promise<void> {
    await loadConfiguration(process.argv[2]);
    logger.info("Starting in dev mode ...");

    for (const module of config.cli.modules) {
        try {
            await import(module);
            logger.info("Loaded module " + module);
        } catch (e) {
            logger.fatal(`Error while loading module ${module}`, e);
        }
    }

    await bootstrap();
}

main();
