import { ConverterBuilderFactory } from "@replikit/commands/typings";
import {
    PermissionStorage,
    UserPermission,
    EntityType,
    PermissionsLocale,
    UserRole,
    MemberPermission,
    MemberRole
} from "@replikit/permissions";

/** @internal */
export function registerPermissionsConverters(
    converter: ConverterBuilderFactory,
    permissionStorage: PermissionStorage
): void {
    converter(UserPermission)
        .validator((context, param) => {
            const permission = permissionStorage.permissions.find(x => {
                return x.matches(EntityType.User, param);
            });
            if (permission) return permission;
            const locale = context.getLocale(PermissionsLocale);
            const values = permissionStorage.getPermissionNames(EntityType.User);
            return `${locale.invalidPermission} ${locale.validValues(values)}`;
        })
        .register();

    converter(UserRole)
        .validator((context, param) => {
            const role = permissionStorage.roles.find(x => {
                return x.matches(EntityType.User, param);
            });
            if (role) return role;
            const locale = context.getLocale(PermissionsLocale);
            const values = permissionStorage.getRoleNames(EntityType.User);
            return `${locale.invalidRole} ${locale.validValues(values)}`;
        })
        .register();

    converter(MemberPermission)
        .validator((context, param) => {
            const permission = permissionStorage.permissions.find(x => {
                return x.matches(EntityType.Member, param);
            });
            if (permission) return permission;
            const locale = context.getLocale(PermissionsLocale);
            const values = permissionStorage.getPermissionNames(EntityType.Member);
            return `${locale.invalidPermission} ${locale.validValues(values)}`;
        })
        .register();

    converter(MemberRole)
        .validator((context, param) => {
            const role = permissionStorage.roles.find(x => {
                return x.matches(EntityType.Member, param);
            });
            if (role) return role;
            const locale = context.getLocale(PermissionsLocale);
            const values = permissionStorage.getRoleNames(EntityType.Member);
            return `${locale.invalidRole} ${locale.validValues(values)}`;
        })
        .register();
}
