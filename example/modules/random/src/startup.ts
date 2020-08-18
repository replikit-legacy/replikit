import { createScope, hook, config, updateConfig } from "@replikit/core";

/** @internal */
export const logger = createScope("random");

updateConfig({ random: { disableDebugHandlers: false } });

hook("core:startup:init", async () => {
    if (config.random.disableDebugHandlers) return;
    await import("./handlers/debug");
});
