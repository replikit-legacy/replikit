import "@replikit/commands/typings";
import {
    UserPermissionName,
    MemberPermissionName
} from "@replikit/permissions/typings";

declare module "@replikit/commands/typings/commandBuilder" {
    export interface CommandBuilder {
        authorizeUser(permission: UserPermissionName): this;
        channel(name?: string): this;
        authorizeMember(permission: MemberPermissionName): this;
    }
}
