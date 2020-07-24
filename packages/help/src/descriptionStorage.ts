import { HelpMessage } from "@replikit/help/typings";
import { deepmerge, config, groupBy } from "@replikit/core";
import { Command } from "@replikit/commands/typings";
import { InvalidCommandDescriptionError, DefaultLocaleNotFoundError } from "@replikit/help";

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

    private renderOverloads(description: string | HelpMessage, overloads: Command[]): string {
        if (typeof description !== "string") {
            throw new InvalidCommandDescriptionError();
        }

        return [`# ${description}`, ...overloads.map(x => x.usage!)].join("\n");
    }

    private renderCommand(description: HelpMessage | string, command: Command): string | undefined {
        if (!description) {
            return undefined;
        }

        if (command.handler) {
            if (typeof description !== "string") {
                throw new InvalidCommandDescriptionError();
            }
            return `# ${description}\n${command.usage!}\n`;
        }

        if (typeof description === "string") {
            throw new InvalidCommandDescriptionError();
        }

        const groups = groupBy(command.commands, "name");

        return groups
            .map(group =>
                group.value.length === 1
                    ? this.renderCommand(description[group.key], group.value[0])
                    : this.renderOverloads(description[group.key], group.value)
            )
            .filter(x => x)
            .join("\n");
    }

    render(commands: Command[], locale?: string): string {
        const description =
            this.descriptionMap.get(locale!) ?? this.descriptionMap.get(config.help.defaultLocale);

        if (!description) {
            throw new DefaultLocaleNotFoundError(config.help.defaultLocale);
        }

        return this.renderCommand(description, { commands } as Command) ?? "";
    }
}

export const descriptions = new DescriptionStorage();
