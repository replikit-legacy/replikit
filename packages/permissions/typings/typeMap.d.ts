import {
    UserPermissionMap,
    MemberPermissionMap,
    UserRoleMap,
    MemberRoleMap
} from "@replikit/permissions/typings";

export interface TypeMap {
    user: [UserRoleMap, UserPermissionMap];
    member: [MemberRoleMap, MemberPermissionMap];
}

export type TypeName = keyof TypeMap;

type _RoleName<T extends TypeName> = keyof TypeMap[T][0];

export type RoleName<
    T extends TypeName = TypeName
> = /**************/ _RoleName<T> extends never ? unknown : _RoleName<T>;

type _PermissionName<T extends TypeName> = keyof TypeMap[T][1];

export type PermissionName<
    T extends TypeName = TypeName
> = /****/ _PermissionName<T> extends never ? unknown : _PermissionName<T>;

export type UserPermissionName = PermissionName<"user">;
export type MemberPermissionName = PermissionName<"member">;
