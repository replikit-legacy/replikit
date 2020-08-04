import { applyMixins, hook, extendModule } from "@replikit/core";
import { User, Member, connection, ConnectionManager } from "@replikit/storage";
import {
    HasPermissions,
    permissionStorage,
    registerPermissionsConverters
} from "@replikit/permissions";

applyMixins(User, [HasPermissions]);
applyMixins(Member, [HasPermissions]);

export function registerPermissionsDefaults(connection: ConnectionManager): void {
    const users = connection.getRepository(User);
    users.setDefault("permissions", []);
    users.setDefault("roles", []);

    const members = connection.getRepository(Member);
    members.setDefault("permissions", []);
    members.setDefault("roles", []);
}

extendModule<typeof import("@replikit/commands")>("@replikit/commands", ({ converter }) => {
    registerPermissionsConverters(converter, permissionStorage);
});

hook("storage:database:done", () => {
    registerPermissionsDefaults(connection);
});
