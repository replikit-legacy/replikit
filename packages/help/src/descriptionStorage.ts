import { HelpMessage } from "@replikit/help/typings";
import { deepmerge, config } from "@replikit/core";
import { Command } from "@replikit/commands/typings";
import {
    InvalidCommandDescriptionError,
    DefaultLocaleNotFoundError
} from "@replikit/help";

export class DescriptionStorage {
    private readonly descriptionMap = new Map<string, HelpMessage>();

    add(locale: string, descriptions: HelpMessage): void {
        const description = this.descriptionMap.get(locale);
        if (description) {
            deepmerge(description, descriptions);
            return;
        }
        this.descriptionMap.set(locale, descriptions);
    }

    private renderCommand(descriptions: HelpMessage, command: Command): string {
        const description = descriptions[command.name];

        if (!description) {
            return "";
        }

        if (command.handler) {
            if (typeof description !== "string") {
                throw new InvalidCommandDescriptionError();
            }
            return `# ${description}\n${command.usage!}`;
        }

        if (typeof description === "string") {
            throw new InvalidCommandDescriptionError();
        }

        return `\n${command.commands
            .map(this.renderCommand.bind(this, description))
            .join("\n")}`;
    }

    render(commands: Command[], locale?: string): string {
        const description =
            this.descriptionMap.get(locale!) ??
            this.descriptionMap.get(config.help.defaultLocale);

        if (!description) {
            throw new DefaultLocaleNotFoundError(config.help.defaultLocale);
        }

        return commands
            .map(this.renderCommand.bind(this, description))
            .join("\n");
    }
}

export const descriptions = new DescriptionStorage();
