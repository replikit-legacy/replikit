import { LogProvider } from "@replikit/core/typings";
import { ConsoleLogProvider, LogLevel } from "@replikit/core";

class LogManager {
    private level = LogLevel.Info;
    private readonly logProviders: LogProvider[] = [];

    constructor(private primaryLogProvider: LogProvider) {}

    addLogProvider(provider: LogProvider): void {
        this.logProviders.push(provider);
    }

    setPrimaryProvider(provider: LogProvider): void {
        this.primaryLogProvider = provider;
    }

    setLevel(level: LogLevel): void {
        this.level = level;
    }

    log(level: LogLevel, message: string, scopes: string[], error?: Error): void {
        if (level <= this.level) {
            this.primaryLogProvider.log(level, message, scopes, error);
            for (const provider of this.logProviders) {
                provider.log(level, message, scopes, error);
            }
        }
    }
}

export const logManager = new LogManager(new ConsoleLogProvider());
