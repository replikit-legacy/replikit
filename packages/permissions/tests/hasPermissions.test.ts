import {
    HasPermissions,
    PermissionStorage,
    Role,
    EntityType,
    RoleInstance,
    PermissionInstance,
    Enum
} from "@replikit/permissions";
import { TestUserPermission, TestUserRole } from "@replikit/permissions/tests";

function createExtension(): HasPermissions {
    const extension = new HasPermissions();
    const storage = new PermissionStorage();
    RoleInstance._permissionStorage = storage;
    PermissionInstance._permissionStorage = storage;
    extension.permissions = [];
    extension.roles = [];
    extension._permissionStorage = storage;
    return extension;
}

describe("HasPermissions", () => {
    it("should check permission directly", () => {
        const extension = createExtension();
        extension.permit(TestUserPermission.Test1);

        expect(extension.hasPermission(TestUserPermission.Test1)).toBeTruthy();
        expect(extension.hasPermission(TestUserPermission.Test2)).toBeFalsy();
    });

    it("should check role directly", () => {
        const extension = createExtension();
        extension.appoint(TestUserRole.Test1);

        expect(extension.hasRole(TestUserRole.Test1)).toBeTruthy();
        expect(extension.hasRole(TestUserRole.Test2)).toBeFalsy();
    });

    it("should check permission via role", () => {
        const extension = createExtension();

        @Enum("test")
        class TestUserRole extends Role(EntityType.User) {
            static readonly Admin = new TestUserRole({
                permissions: [TestUserPermission.Test1]
            });
        }

        extension.appoint(TestUserRole.Admin);

        expect(extension.hasPermission(TestUserPermission.Test1)).toBeTruthy();
        expect(extension.hasPermission(TestUserPermission.Test2)).toBeFalsy();
    });

    it("should check permission via fallback role", () => {
        const extension = createExtension();

        @Enum("test")
        class TestUserRole extends Role(EntityType.User) {
            static readonly Moderator = new TestUserRole({
                permissions: [TestUserPermission.Test1]
            });

            static readonly Admin = new TestUserRole({
                permissions: [TestUserPermission.Test2],
                fallbackRoles: [TestUserRole.Moderator]
            });
        }

        extension.appoint(TestUserRole.Admin);

        expect(extension.hasPermission(TestUserPermission.Test1)).toBeTruthy();
        expect(extension.hasPermission(TestUserPermission.Test2)).toBeTruthy();
        expect(extension.hasPermission(TestUserPermission.Test3)).toBeFalsy();
    });

    it("should check role via fallback role", () => {
        const extension = createExtension();

        @Enum("test")
        class TestUserRole extends Role(EntityType.User) {
            static readonly Moderator = new TestUserRole();
            static readonly SuperUser = new TestUserRole();

            static readonly Admin = new TestUserRole({
                fallbackRoles: [TestUserRole.Moderator]
            });
        }

        extension.appoint(TestUserRole.Admin);

        expect(extension.hasRole(TestUserRole.Admin)).toBeTruthy();
        expect(extension.hasRole(TestUserRole.Moderator)).toBeTruthy();
        expect(extension.hasRole(TestUserRole.SuperUser)).toBeFalsy();
    });

    it("should permit and revoke only once", () => {
        const extension = createExtension();
        expect(extension.permissions).toHaveLength(0);

        extension.permit(TestUserPermission.Test1);
        extension.permit(TestUserPermission.Test1);
        expect(extension.permissions).toHaveLength(1);

        extension.revoke(TestUserPermission.Test1);
        extension.revoke(TestUserPermission.Test1);
        expect(extension.permissions).toHaveLength(0);
    });

    it("should appoint and dismiss only once", () => {
        const extension = createExtension();
        expect(extension.roles).toHaveLength(0);

        extension.appoint(TestUserRole.Test1);
        extension.appoint(TestUserRole.Test1);
        expect(extension.roles).toHaveLength(1);

        extension.dismiss(TestUserRole.Test1);
        extension.dismiss(TestUserRole.Test1);
        expect(extension.roles).toHaveLength(0);
    });
});
