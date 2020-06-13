import { LogLevel, logManager, hook } from "@replikit/core";

logManager.setLevel(LogLevel.Fatal);

hook("core:settings:update", () => {
    logManager.setLevel(LogLevel.Fatal);
});
