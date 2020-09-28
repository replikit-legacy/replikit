import { Command } from "@replikit/commands";
import { connection } from "@replikit/storage";
import { DartThrow, DartsLocale } from "@example/darts";
import { DartThrow as PlainDartThrow } from "@example/darts/typings";
import { renderDate } from "@replikit/core";
import { MessageBuilder } from "@replikit/messages";
import { CommandResult } from "@replikit/commands/typings";

export class ThrowsCommand extends Command {
    name = "throws";

    async execute(): Promise<CommandResult> {
        const user = await this.getUser();
        const collection = connection.getCollection(DartThrow);
        const throws = await collection
            .find({ userId: user._id })
            .sort({ _id: -1 })
            .limit(10)
            .toArray();
        const locale = this.getLocale(DartsLocale);
        return new MessageBuilder()
            .addCodeLine(locale.last10Throws)
            .addCodeLines(throws.map(renderThrow));
    }
}

function renderThrow(dartThrow: PlainDartThrow): string {
    const date = renderDate(dartThrow.date, true);
    return `${dartThrow.emoji} [${date}] Результат: ${dartThrow.value}`;
}
