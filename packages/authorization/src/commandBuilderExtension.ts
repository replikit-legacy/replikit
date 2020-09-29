import { CommandBuilder } from "@replikit/commands";
import { Extension } from "@replikit/core";
import { authorizeMember, authorizeUser } from "@replikit/authorization";
import { UserPermission, MemberPermission } from "@replikit/permissions";

@Extension
export class CommandBuilderExtension extends CommandBuilder {
    authorizeUser(permission: UserPermission): this {
        return this.use(authorizeUser(permission));
    }

    authorizeMember(permission: MemberPermission): this {
        return this.use(authorizeMember(permission));
    }
}
