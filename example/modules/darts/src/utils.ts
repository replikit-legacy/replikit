import { MessageBuilder } from "@replikit/messages";
import { User } from "@replikit/storage";
import { DartsLocale } from "@example/darts/typings";

export function addUserStats(
    builder: MessageBuilder,
    user: User,
    t: DartsLocale
): void {
    builder
        .addCodeLine(t.userStats)
        .addCodeLine(t.totalScore(user.darts.sum))
        .addCodeLine(t.totalThrows(user.darts.total))
        .addCodeLine(t.average(user.darts.average.toFixed(2)));
}
