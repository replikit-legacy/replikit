import { LogLevel } from "@replikit/core";

export interface LogProvider {
    log(
        level: LogLevel,
        message: string,
        scopes: string[],
        error?: Error
    ): void;
}
