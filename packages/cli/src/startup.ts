import { createScope, logManager, updateConfig } from "@replikit/core";
import { ColorfulConsoleLogProvider } from "@replikit/chalk";

const logProvider = new ColorfulConsoleLogProvider();
logManager.setPrimaryProvider(logProvider);

/** @internal */
export const logger = createScope("cli");

updateConfig({ cli: { modules: [] } });
