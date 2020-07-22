import { locales } from "@replikit/i18n";
import { DartsLocale } from "@example/darts";

locales.add("ru", DartsLocale, {
    last10Throws: "Последние 10 бросков:",
    average: average => `Среднее: ${average}`,
    totalScore: score => `Всего очков: ${score}`,
    totalThrows: throws => `Всего бросков: ${throws}`,
    userStats: "=== Статистика пользователя ==="
});
