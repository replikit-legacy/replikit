import {
    PermissionStorage,
    PermissionInstance,
    RoleInstance,
    Enum,
    Permission,
    EntityType,
    Role
} from "@replikit/permissions";

function createPermissionStorage(): PermissionStorage {
    const storage = new PermissionStorage();
    RoleInstance._permissionStorage = storage;
    PermissionInstance._permissionStorage = storage;
    return storage;
}

describe("PermissionStorage", () => {
    it("should get the list of permission names by type", () => {
        const storage = createPermissionStorage();

        @Enum("test")
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestUserPermission extends Permission(EntityType.User) {
            static readonly Test1 = new TestUserPermission();
        }

        const result = storage.getPermissionNames(EntityType.User);
        expect(result).toStrictEqual(["Test1"]);
    });

    it("should get the list of role names by type", () => {
        const storage = createPermissionStorage();

        @Enum("test")
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestUserRole extends Role(EntityType.User) {
            static readonly Test1 = new TestUserRole();
        }

        const result = storage.getRoleNames(EntityType.User);
        expect(result).toStrictEqual(["Test1"]);
    });
});
