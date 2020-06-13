import { locales } from "@replikit/i18n";

locales.add("en", "commands", {
    mismatch: (expected, actual) =>
        `Argument count mismatch.\n${expected} expected, got ${actual}.`,
    numberRequired: "Number required",
    booleanRequired: "Boolean required",
    positiveNumberRequired: "Positive number required",
    commandNotFound: "Command not found",
    usage: "Usage:",
    emptyMultilineParameter: "Empty multiline parameter",
    shouldBeNoMoreParametersThan: value =>
        `The number of additional parameters should be no more than ${value}`,
    shouldBeNoLessParametersThan: value =>
        `The number of additional parameters should be no less than ${value}`,
    shouldBeNoLessThan: value => `The value should be no less than ${value}`,
    shouldBeNoMoreThan: value => `The value should be no more than ${value}`,
    integerRequired: "Integer required"
});
