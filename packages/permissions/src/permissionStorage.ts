import {
    HasPermissions,
    EntityType,
    RoleInstance,
    PermissionInstance
} from "@replikit/permissions";

function checkPermission(target: RoleInstance, permission: PermissionInstance): boolean {
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

function checkRole(target: RoleInstance, targetRole: RoleInstance): boolean {
    for (const role of target.fallbackRoles) {
        if (role === targetRole) {
            return true;
        }
        if (checkRole(role, targetRole)) {
            return true;
        }
    }
    return false;
}

export class PermissionStorage {
    /** @internal */
    readonly _roles: RoleInstance[] = [];

    /** @internal */
    readonly _permissions: PermissionInstance[] = [];

    get roles(): readonly RoleInstance[] {
        return this._roles;
    }

    get permissions(): readonly PermissionInstance[] {
        return this._permissions;
    }

    getPermissionNames(type: EntityType): string[] {
        return this.permissions.filter(x => x.type.equals(type)).map(x => x.name);
    }

    getRoleNames(type: EntityType): string[] {
        return this.roles.filter(x => x.type.equals(type)).map(x => x.name);
    }

    checkRole(hasPermissions: HasPermissions, targetRole: RoleInstance): boolean {
        if (hasPermissions.roles.includes(targetRole.id)) {
            return true;
        }

        for (const role of hasPermissions.roles) {
            const info = this.roles.find(x => x.id === role);
            if (!info) {
                continue;
            }
            if (checkRole(info, targetRole)) {
                return true;
            }
        }

        return false;
    }

    checkPermission(hasPermissions: HasPermissions, permission: PermissionInstance): boolean {
        if (hasPermissions.permissions.includes(permission.id)) {
            return true;
        }

        for (const role of hasPermissions.roles) {
            const info = this.roles.find(x => x.id === role);
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

export const permissionStorage = new PermissionStorage();
