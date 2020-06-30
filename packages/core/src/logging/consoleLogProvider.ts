import { LogProvider } from "@replikit/core/typings";
import { LogLevel, renderDate } from "@replikit/core";

export class ConsoleLogProvider implements LogProvider {
    protected static readonly logLevelMap = {
        [LogLevel.Fatal]: "FTL",
        [LogLevel.Error]: "ERR",
        [LogLevel.Warning]: "WRN",
        [LogLevel.Info]: "INF",
        [LogLevel.Debug]: "DBG",
        [LogLevel.Verbose]: "VRB"
    };

    log(level: LogLevel, message: string, scopes: string[], error?: Error): void {
        const date = renderDate(new Date());
        const type = ConsoleLogProvider.logLevelMap[level];
        const scopesText = this.renderScopes(scopes);
        const errorText = this.renderError(error);
        console.log(`[${type}] [${date}]${scopesText}${message}${errorText}`);
    }

    protected renderError(error: Error | undefined): string {
        return error ? `\nInternal error: ${error.message}${error.stack}` : "";
    }

    protected renderScopes(scopes: string[]): string {
        if (!scopes.length) {
            return " ";
        }
        return " " + scopes.map(x => `[${x}]`).join(" ") + " ";
    }
}
