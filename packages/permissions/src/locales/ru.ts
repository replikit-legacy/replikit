import { locales } from "@replikit/i18n";
import { PermissionsLocale } from "@replikit/permissions";

locales.add("ru", PermissionsLocale, {
    invalidPermission: "Неправильное разрешение.",
    invalidRole: "Неправильная роль.",
    validValues: values => `Допустимые значения: ${values.join(", ")}`
});
