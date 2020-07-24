import { command } from "@replikit/commands";
import { connection } from "@replikit/storage";
import { DartThrow, DartsLocale } from "@example/darts";
import { DartThrow as PlainDartThrow } from "@example/darts/typings";
import { renderDate } from "@replikit/core";
import { MessageBuilder } from "@replikit/messages";
import { CommandContext, CommandResult } from "@replikit/commands/typings";

command("throws")
    .handler(handler)
    .register();

async function handler(context: CommandContext): Promise<CommandResult> {
    const user = await context.getUser();
    const collection = connection.getCollection(DartThrow);
    const throws = await collection
        .find({ userId: user._id })
        .sort({ _id: -1 })
        .limit(10)
        .toArray();
    const locale = context.getLocale(DartsLocale);
    return new MessageBuilder()
        .addCodeLine(locale.last10Throws)
        .addCodeLines(throws.map(renderThrow));
}

function renderThrow(dartThrow: PlainDartThrow): string {
    const date = renderDate(dartThrow.date, true);
    return `${dartThrow.emoji} [${date}] Результат: ${dartThrow.value}`;
}
