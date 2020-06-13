import { LogLevel, renderDate, ConsoleLogProvider } from "@replikit/core";
import { blue, green, red, yellow, white, grey, gray, cyan } from "chalk";

export class ColorfulConsoleLogProvider extends ConsoleLogProvider {
    private static readonly logLevelColorMap = {
        [LogLevel.Fatal]: red,
        [LogLevel.Error]: red,
        [LogLevel.Warning]: yellow,
        [LogLevel.Info]: cyan,
        [LogLevel.Debug]: gray,
        [LogLevel.Verbose]: grey
    };

    private static readonly messageColorMap = {
        [LogLevel.Fatal]: red,
        [LogLevel.Error]: red,
        [LogLevel.Warning]: yellow,
        [LogLevel.Info]: white,
        [LogLevel.Debug]: white,
        [LogLevel.Verbose]: white
    };

    log(
        level: LogLevel,
        message: string,
        scopes: string[],
        error?: Error | undefined
    ): void {
        const date = renderDate(new Date());
        const scopesText = this.renderScopes(scopes);
        const typeColor = ColorfulConsoleLogProvider.logLevelColorMap[level];
        const typeText = typeColor(ConsoleLogProvider.logLevelMap[level]);
        const messageColor = ColorfulConsoleLogProvider.messageColorMap[level];
        const fullMessage = messageColor(message + this.renderError(error));
        console.log(`[${typeText}] [${blue(date)}]${scopesText}${fullMessage}`);
    }

    protected renderScopes(scopes: string[]): string {
        if (!scopes.length) {
            return " ";
        }
        return " " + scopes.map(x => `[${green(x)}]`).join(" ") + " ";
    }
}
