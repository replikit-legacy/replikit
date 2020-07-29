import {
    PermissionStorage,
    permissionStorage,
    EntityType,
    PermissionInstance,
    RoleInstance
} from "@replikit/permissions";
import { Exclude } from "class-transformer";

export class HasPermissions<T extends EntityType = EntityType> {
    roles: string[];
    permissions: string[];

    /** @internal */
    _permissionStorage?: PermissionStorage;

    @Exclude()
    private get permissionStorage(): PermissionStorage {
        return this._permissionStorage ?? permissionStorage;
    }

    hasRole(role: RoleInstance<T>): boolean {
        return this.permissionStorage.checkRole(this, role);
    }

    hasPermission(permission: PermissionInstance<T>): boolean {
        return this.permissionStorage.checkPermission(this, permission);
    }

    permit(permission: PermissionInstance<T>): void {
        if (!this.permissions.includes(permission.id)) {
            this.permissions.push(permission.id);
        }
    }

    revoke(permission: PermissionInstance<T>): void {
        const index = this.permissions.indexOf(permission.id);
        if (index !== -1) {
            this.permissions.splice(index, 1);
        }
    }

    appoint(role: RoleInstance<T>): void {
        if (!this.roles.includes(role.id)) {
            this.roles.push(role.id);
        }
    }

    dismiss(role: RoleInstance<T>): void {
        const index = this.roles.indexOf(role.id);
        if (index !== -1) {
            this.roles.splice(index, 1);
        }
    }
}
