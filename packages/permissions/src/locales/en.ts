import { locales } from "@replikit/i18n";
import { PermissionsLocale } from "@replikit/permissions";

locales.add("en", PermissionsLocale, {
    invalidPermission: "Invalid permission.",
    invalidRole: "Invalid role.",
    validValues: values => `Valid values: ${values.join(", ")}`
});
