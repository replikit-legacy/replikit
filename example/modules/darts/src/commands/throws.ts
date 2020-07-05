import { command } from "@replikit/commands";
import { connection } from "@replikit/storage";
import { DartThrow } from "@example/darts";
import { DartThrow as PlainDartThrow } from "@example/darts/typings";
import { renderDate } from "@replikit/core";
import { MessageBuilder } from "@replikit/messages";

function renderThrow(dartThrow: PlainDartThrow): string {
    const date = renderDate(dartThrow.date, true);
    return `${dartThrow.emoji} [${date}] Результат: ${dartThrow.value}`;
}

command("throws")
    .handler(async context => {
        const user = await context.getUser();
        const collection = connection.getCollection(DartThrow);
        const throws = await collection
            .find({ userId: user._id })
            .sort({ _id: -1 })
            .limit(10)
            .toArray();
        return new MessageBuilder()
            .addCodeLine(context.t.darts.last10Throws)
            .addCodeLines(throws.map(renderThrow));
    })
    .register();
