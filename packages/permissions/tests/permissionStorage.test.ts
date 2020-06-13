import {
    PermissionStorage,
    RoleNotFoundError,
    InvalidFallbackRoleError
} from "@replikit/permissions";

describe("PermissionStorage", () => {
    it("should add a list of permissions", () => {
        const storage = new PermissionStorage();
        storage.addPermissions("user", ["test1", "test2"]);

        expect(storage).toMatchSnapshot();
    });

    it("should add a role with permissions", () => {
        const storage = new PermissionStorage();
        storage.updateRole("user", "Admin", {
            permissions: ["test1", "test2"]
        });

        expect(storage).toMatchSnapshot();
    });

    it("should add a role with fallbackRole", () => {
        const storage = new PermissionStorage();
        storage.updateRole("user", "Moderator");
        storage.updateRole("user", "Admin", {
            fallbackRoles: ["Moderator"]
        });

        expect(storage).toMatchSnapshot();
    });

    it("should throw an error if fallbackRole not exists", () => {
        const storage = new PermissionStorage();
        expect(() => {
            storage.updateRole("user", "Admin", {
                fallbackRoles: ["Moderator"]
            });
        }).toThrow(RoleNotFoundError);
    });

    it("should throw an error if fallbackRole matches the primary role name", () => {
        const storage = new PermissionStorage();
        expect(() => {
            storage.updateRole("user", "Admin", {
                fallbackRoles: ["Admin"]
            });
        }).toThrow(InvalidFallbackRoleError);
    });

    it("should update the existing role", () => {
        const storage = new PermissionStorage();
        storage.updateRole("user", "Moderator");
        storage.updateRole("user", "Admin", {
            permissions: ["test1", "test2"]
        });
        storage.updateRole("user", "Admin", {
            permissions: ["test3"],
            fallbackRoles: ["Moderator"]
        });

        expect(storage).toMatchSnapshot();
    });
});
