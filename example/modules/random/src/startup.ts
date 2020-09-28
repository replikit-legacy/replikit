import { ConfirmationView, CounterView, UniversityView } from "@example/random";
import { createScope, hook, config, updateConfig } from "@replikit/core";
import { viewStorage } from "@replikit/views";

/** @internal */
export const logger = createScope("random");

updateConfig({ random: { disableDebugHandlers: false } });

viewStorage.register(CounterView);
viewStorage.register(ConfirmationView);
viewStorage.register(UniversityView);

hook("core:startup:init", async () => {
    if (config.random.disableDebugHandlers) return;
    await import("./handlers/debug");
});
