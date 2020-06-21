import {
    RoleInfo,
    TypeName,
    RoleName,
    PermissionName
} from "@replikit/permissions/typings";
import {
    HasPermissions,
    RoleNotFoundError,
    InvalidFallbackRoleError
} from "@replikit/permissions";

function checkPermission(target: RoleInfo, permission: unknown): boolean {
    if (target.permissions.includes(permission)) {
        return true;
    }
    for (const role of target.fallbackRoles) {
        if (checkPermission(role, permission)) {
            return true;
        }
    }
    return false;
}

function checkRole(target: RoleInfo, roleName: unknown): boolean {
    for (const role of target.fallbackRoles) {
        if (role.name === roleName) {
            return true;
        }
        if (checkRole(role, roleName)) {
            return true;
        }
    }
    return false;
}

interface UpdateRoleInfo<T extends TypeName> {
    permissions?: PermissionName<T>[];
    fallbackRoles?: RoleName<T>[];
}

export class PermissionStorage {
    private readonly roles: RoleInfo[] = [];
    private readonly permissionMap = new Map<TypeName, unknown[]>();

    getPermissionNames(type: TypeName): string[] {
        return (this.permissionMap.get(type) as string[]) ?? [];
    }

    getRoleNames(type: TypeName): string[] {
        return this.roles
            .filter(x => x.type === type)
            .map(x => x.name as string);
    }

    addPermissions<T extends TypeName>(
        type: T,
        permissions: PermissionName<T>[]
    ): void {
        let permissionArray = this.permissionMap.get(type);
        if (!permissionArray) {
            permissionArray = [];
            this.permissionMap.set(type, permissionArray);
        }
        for (const permission of permissions) {
            if (!permissionArray.includes(permission)) {
                permissionArray.push(permission);
            }
        }
    }

    private resolveRoles(roleNames: unknown[]): RoleInfo[] {
        return roleNames.map(name => {
            const info = this.roles.find(x => x.name === name);
            if (!info) {
                throw new RoleNotFoundError(name);
            }
            return info;
        });
    }

    updateRole<T extends TypeName>(
        type: T,
        name: RoleName<T>,
        info?: UpdateRoleInfo<T>
    ): void {
        if (info?.fallbackRoles?.includes(name)) {
            throw new InvalidFallbackRoleError(name);
        }

        let role = this.roles.find(x => x.name === name);
        if (!role) {
            role = {
                type,
                name,
                fallbackRoles: info?.fallbackRoles
                    ? this.resolveRoles(info.fallbackRoles)
                    : [],
                permissions: info?.permissions ?? []
            };
            this.roles.push(role);
            return;
        }
        if (!info) {
            return;
        }
        if (info.fallbackRoles) {
            role.fallbackRoles.push(...this.resolveRoles(info.fallbackRoles));
        }
        if (info.permissions) {
            role.permissions.push(...info.permissions);
        }
    }

    checkRole(hasPermissions: HasPermissions, targetRole: unknown): boolean {
        if (hasPermissions.roles.includes(targetRole)) {
            return true;
        }

        for (const role of hasPermissions.roles) {
            const info = this.roles.find(x => x.name === role);
            if (!info) {
                continue;
            }
            if (checkRole(info, targetRole)) {
                return true;
            }
        }

        return false;
    }

    checkPermission(
        hasPermissions: HasPermissions,
        permission: unknown
    ): boolean {
        if (hasPermissions.permissions.includes(permission)) {
            return true;
        }

        for (const role of hasPermissions.roles) {
            const info = this.roles.find(x => x.name === role);
            if (!info) {
                continue;
            }
            if (checkPermission(info, permission)) {
                return true;
            }
        }

        return false;
    }
}

export const permissions = new PermissionStorage();
