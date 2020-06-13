import { HasPermissions, PermissionStorage } from "@replikit/permissions";

interface ExtensionResult {
    extension: HasPermissions;
    storage: PermissionStorage;
}

function createExtension(): ExtensionResult {
    const extension = new HasPermissions();
    const storage = new PermissionStorage();
    extension.permissions = [];
    extension.roles = [];
    extension.permissionStorage = storage;
    return { extension, storage };
}

describe("HasPermissions", () => {
    it.each([
        ["permission", "permit", "hasPermission"],
        ["role", "appoint", "hasRole"]
    ] as const)("should check %s directly", (_, add, check) => {
        const { extension } = createExtension();
        extension[add]("test1");

        expect(extension[check]("test1")).toBeTruthy();
        expect(extension[check]("test2")).toBeFalsy();
    });

    it("should check permission via role", () => {
        const { extension, storage } = createExtension();
        storage.updateRole("user", "Admin", { permissions: ["test1"] });
        extension.appoint("Admin");

        expect(extension.hasPermission("test1")).toBeTruthy();
        expect(extension.hasPermission("test2")).toBeFalsy();
    });

    it("should check permission via fallback role", () => {
        const { extension, storage } = createExtension();
        storage.updateRole("user", "Moderator", { permissions: ["test1"] });
        storage.updateRole("user", "Admin", {
            permissions: ["test2"],
            fallbackRoles: ["Moderator"]
        });
        extension.appoint("Admin");

        expect(extension.hasPermission("test1")).toBeTruthy();
        expect(extension.hasPermission("test2")).toBeTruthy();
        expect(extension.hasPermission("test3")).toBeFalsy();
    });

    it("should check role via fallback role", () => {
        const { extension, storage } = createExtension();
        storage.updateRole("user", "Moderator");
        storage.updateRole("user", "Admin", { fallbackRoles: ["Moderator"] });
        extension.appoint("Admin");

        expect(extension.hasRole("Admin")).toBeTruthy();
        expect(extension.hasRole("Moderator")).toBeTruthy();
        expect(extension.hasRole("SU")).toBeFalsy();
    });

    it.each([
        ["permit", "revoke", "permissions"],
        ["appoint", "dismiss", "roles"]
    ] as const)("should %s and %s only once", (add, remove, collection) => {
        const { extension } = createExtension();

        extension[add]("test1");
        extension[add]("test1");
        expect(extension[collection]).toHaveLength(1);

        extension[remove]("test1");
        extension[remove]("test1");
        expect(extension[collection]).toHaveLength(0);
    });
});
