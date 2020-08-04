import { locales, ru } from "@replikit/i18n";
import { CommandsLocale } from "@replikit/commands";

locales.add("ru", CommandsLocale, {
    mismatch: (expected, actual) => {
        const actualText = ru.plural(actual, "получен", "получено");
        return `Несоответствие количества аргументов.\nТребуется ${expected}, ${actualText} ${actual}.`;
    },
    numberRequired: "Требуется число",
    booleanRequired: "Требуется логическое значение",
    positiveNumberRequired: "Требуется положительное число",
    commandNotFound: "Команда не найдена",
    usage: "Использование:",
    emptyTextParameter: "Пустой текстовый параметр",
    shouldBeNoMoreParametersThan: value =>
        `Количество дополнительных параметров должно быть не больше ${value}`,
    shouldBeNoLessParametersThan: value =>
        `Количество дополнительных параметров должно быть не меньше ${value}`,
    shouldBeNoLessThan: value => `Значение должно быть не меньше ${value}`,
    shouldBeNoMoreThan: value => `Значение должно быть не больше ${value}`,
    integerRequired: "Требуется целое число",
    errorWhenResolvingDefaultValue: "Ошибка при разрешении значения по умолчанию"
});
