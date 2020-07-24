import { locales } from "@replikit/i18n";
import { DartsLocale } from "@example/darts";

locales.add("en", DartsLocale, {
    last10Throws: "Last 10 throws:",
    average: average => `Average: ${average}`,
    totalScore: score => `Total score: ${score}`,
    totalThrows: throws => `Total throws: ${throws}`,
    userStats: "=== User stats ==="
});
