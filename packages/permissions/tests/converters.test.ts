import {
    MemberPermission,
    UserPermission,
    UserRole,
    MemberRole,
    registerPermissionsConverters,
    permissionStorage
} from "@replikit/permissions";
import "@replikit/permissions/tests";
import { createTestManager, TestManagerSuite } from "@replikit/test-utils";
import { Constructor } from "@replikit/core/typings";

function createConverterTestManager(): TestManagerSuite {
    const suite = createTestManager();
    registerPermissionsConverters(suite.converter, permissionStorage);
    return suite;
}

describe("converters", () => {
    it.each([
        ["user permission", UserPermission],
        ["member permission", MemberPermission],
        ["user role", UserRole],
        ["member role", MemberRole]
    ])("should resolve %s parameter", async (_, type) => {
        const { command, testManager } = createConverterTestManager();
        command("test")
            .required("param", type as Constructor)
            .handler(context => expect(context.params.param).toMatchSnapshot())
            .register();
        await testManager.processCommand("/test Test1");
        expect.assertions(1);
    });

    it.each([
        ["user permission", UserPermission],
        ["member permission", MemberPermission],
        ["user role", UserRole],
        ["member role", MemberRole]
    ])("should throw an error if %s parameter is invalid", async (_, type) => {
        const { command, testManager } = createConverterTestManager();
        command("test")
            .required("param", type as Constructor)
            .handler(context => {
                throw void context;
            })
            .register();
        await testManager.processCommand("/test Test10");
        expect.assertions(1);
    });
});
