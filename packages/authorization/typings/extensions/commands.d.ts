import "@replikit/commands/typings";
import {
    UserPermissionName,
    MemberPermissionName
} from "@replikit/permissions/typings";
import { AddRequired } from "@replikit/commands";
import { Parameters } from "@replikit/commands/typings";
import { Channel } from "@replikit/storage";

declare module "@replikit/commands/typings/commandBuilder" {
    export interface CommandBuilder<
        C = Record<string, unknown>,
        P extends Parameters = Record<string, unknown>
    > {
        authorizeUser(permission: UserPermissionName): this;
        channel(): AddRequired<C, P, "channel", Channel>;
        channel<T extends string>(name: T): AddRequired<C, P, T, Channel>;
        authorizeMember(permission: MemberPermissionName): this;
    }
}
