import {
    TypeName,
    RoleName,
    PermissionName
} from "@replikit/permissions/typings";

export interface RoleInfo<T extends TypeName = TypeName> {
    type: TypeName;
    name: RoleName<T>;
    permissions: PermissionName<T>[];
    fallbackRoles: RoleInfo[];
}
