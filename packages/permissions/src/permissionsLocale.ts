export class PermissionsLocale {
    static readonly namespace = "permissions";

    invalidPermission: string;
    invalidRole: string;
    validValues: (values: string[]) => string;
}
