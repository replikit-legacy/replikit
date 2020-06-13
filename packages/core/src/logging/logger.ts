import { LogLevel, logManager } from "@replikit/core";

export class Logger {
    constructor(protected scopes: string[] = []) {}

    createScope(scope: string): Logger {
        return new Logger([...this.scopes, scope]);
    }

    info(message: string): void {
        logManager.log(LogLevel.Info, message, this.scopes);
    }

    warn(message: string): void {
        logManager.log(LogLevel.Warning, message, this.scopes);
    }

    debug(message: string): void {
        logManager.log(LogLevel.Debug, message, this.scopes);
    }

    trace(message: string): void {
        logManager.log(LogLevel.Verbose, message, this.scopes);
    }

    error(message: string, error?: Error): void {
        logManager.log(LogLevel.Error, message, this.scopes, error);
    }

    fatal(message: string, error?: Error | undefined): never {
        logManager.log(LogLevel.Fatal, message, this.scopes, error);
        process.exit(1);
    }
}

export function createScope(scope: string): Logger {
    return new Logger([scope]);
}

/** @internal */
export const logger = createScope("core");
