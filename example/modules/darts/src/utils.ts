import { MessageBuilder } from "@replikit/messages";
import { DartsLocale, DartsUserExtension } from "@example/darts";

export function addUserStats(
    builder: MessageBuilder,
    darts: DartsUserExtension,
    t: DartsLocale
): MessageBuilder {
    return builder
        .addCodeLine(t.userStats)
        .addCodeLine(t.totalScore(darts.sum))
        .addCodeLine(t.totalThrows(darts.total))
        .addCodeLine(t.average(darts.average.toFixed(2)));
}
