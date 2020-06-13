import { hook, LogLevel, logManager, config } from "@replikit/core";
import { LogLevelName } from "@replikit/core/typings";

const logLevelMap: Record<LogLevelName, LogLevel> = {
    fatal: LogLevel.Fatal,
    error: LogLevel.Error,
    warning: LogLevel.Warning,
    info: LogLevel.Info,
    debug: LogLevel.Debug,
    verbose: LogLevel.Verbose
};

hook("core:settings:update", () => {
    const level = logLevelMap[config.core.logLevel];
    logManager.setLevel(level);
});
