export interface CommandsLocale {
    emptyTextParameter: string;
    mismatch(expected: number, actual: number): string;
    numberRequired: string;
    integerRequired: string;
    positiveNumberRequired: string;
    booleanRequired: string;
    commandNotFound: string;
    usage: string;
    shouldBeNoMoreThan(value: number): string;
    shouldBeNoLessThan(value: number): string;
    shouldBeNoMoreParametersThan(value: number): string;
    shouldBeNoLessParametersThan(value: number): string;
}
