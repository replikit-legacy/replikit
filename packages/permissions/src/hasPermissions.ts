import {
    RoleName,
    PermissionName,
    TypeName
} from "@replikit/permissions/typings";
import { PermissionStorage, permissions } from "@replikit/permissions";

export class HasPermissions<T extends TypeName = TypeName> {
    roles: RoleName<T>[];
    permissions: PermissionName<T>[];

    permissionStorage?: PermissionStorage;

    hasRole(role: RoleName<T>): boolean {
        const storage = this.permissionStorage ?? permissions;
        return storage.checkRole((this as unknown) as HasPermissions, role);
    }

    hasPermission(permission: PermissionName<T>): boolean {
        const storage = this.permissionStorage ?? permissions;
        return storage.checkPermission(
            (this as unknown) as HasPermissions,
            permission
        );
    }

    permit(permission: PermissionName<T>): void {
        if (!this.permissions.includes(permission)) {
            this.permissions.push(permission);
        }
    }

    revoke(permission: PermissionName<T>): void {
        const index = this.permissions.indexOf(permission);
        if (index !== -1) {
            this.permissions.splice(index, 1);
        }
    }

    appoint(role: RoleName<T>): void {
        if (!this.roles.includes(role)) {
            this.roles.push(role);
        }
    }

    dismiss(role: RoleName<T>): void {
        const index = this.roles.indexOf(role);
        if (index !== -1) {
            this.roles.splice(index, 1);
        }
    }
}
