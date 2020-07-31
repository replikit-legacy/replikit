import { applyMixins, hook, extendModule } from "@replikit/core";
import { User, Member, connection, ConnectionManager } from "@replikit/storage";
import {
    HasPermissions,
    UserPermission,
    permissionStorage,
    PermissionsLocale,
    EntityType,
    MemberPermission,
    UserRole,
    MemberRole,
    PermissionStorage
} from "@replikit/permissions";
import { ConverterBuilderFactory } from "@replikit/commands/typings";

applyMixins(User, [HasPermissions]);
applyMixins(Member, [HasPermissions]);

export function registerPermissionsDefaults(connection: ConnectionManager): void {
    const users = connection.getRepository(User);
    users.setDefault("permissions", []);
    users.setDefault("roles", []);

    const member = connection.getRepository(Member);
    member.setDefault("permissions", []);
    member.setDefault("roles", []);
}

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

extendModule<typeof import("@replikit/commands")>("@replikit/commands", ({ converter }) => {
    registerPermissionsConverters(converter, permissionStorage);
    console.log("aaa");
});

hook("storage:database:done", () => {
    registerPermissionsDefaults(connection);
});
