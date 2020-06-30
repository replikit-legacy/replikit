import { applyMixins, hook } from "@replikit/core";
import { User, Member, connection, ConnectionManager } from "@replikit/storage";
import { HasPermissions } from "@replikit/permissions";

applyMixins(User, [HasPermissions]);
applyMixins(Member, [HasPermissions]);

export function registerPermissionsDefaults(connection: ConnectionManager): void {
    const users = connection.getRepository(User);
    users.setDefault("permissions", []);
    users.setDefault("roles", []);

    const member = connection.getRepository(Member);
    member.setDefault("permissions", []);
    member.setDefault("roles", []);
}

hook("storage:database:done", () => {
    registerPermissionsDefaults(connection);
});
