import { locales } from "@replikit/i18n";
import { CommandsLocale } from "@replikit/commands";

locales.add("en", CommandsLocale, {
    mismatch: (expected, actual) =>
        `Argument count mismatch.\n${expected} expected, got ${actual}.`,
    numberRequired: "Number required",
    booleanRequired: "Boolean required",
    positiveNumberRequired: "Positive number required",
    commandNotFound: "Command not found",
    usage: "Usage:",
    emptyTextParameter: "Empty text parameter",
    shouldBeNoMoreParametersThan: value =>
        `The number of additional parameters should be no more than ${value}`,
    shouldBeNoLessParametersThan: value =>
        `The number of additional parameters should be no less than ${value}`,
    shouldBeNoLessThan: value => `The value should be no less than ${value}`,
    shouldBeNoMoreThan: value => `The value should be no more than ${value}`,
    integerRequired: "Integer required",
    errorWhenResolvingDefaultValue: "Error when resolving default value"
});
