/* eslint-disable @typescript-eslint/no-unused-vars */
import "@replikit/commands/typings";
import { Parameters } from "@replikit/commands/typings";
import { PermissionInstance, EntityType } from "@replikit/permissions";

declare module "@replikit/commands/typings/commandBuilder" {
    export interface CommandBuilder<
        C = Record<string, unknown>,
        P extends Parameters = Record<string, unknown>
    > {
        authorizeUser(permission: PermissionInstance<typeof EntityType.User>): this;
        authorizeMember(permission: PermissionInstance<typeof EntityType.Member>): this;
    }
}
