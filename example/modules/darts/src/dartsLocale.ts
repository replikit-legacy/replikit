export class DartsLocale {
    static readonly namespace = "darts";

    userStats: string;
    last10Throws: string;

    totalScore: (score: number) => string;
    totalThrows: (throws: number) => string;
    average: (average: string) => string;
}
