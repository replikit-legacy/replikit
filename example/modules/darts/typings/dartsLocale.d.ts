export interface DartsLocale {
    userStats: string;
    totalScore(score: number): string;
    totalThrows(throws: number): string;
    average(average: string): string;
    last10Throws: string;
}
