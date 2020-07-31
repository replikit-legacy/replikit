import { EntityType, Permission, Role, Enum } from "@replikit/permissions";

@Enum("test")
export class TestUserPermission extends Permission(EntityType.User) {
    static readonly Test1 = new TestUserPermission();
    static readonly Test2 = new TestUserPermission();
    static readonly Test3 = new TestUserPermission();
}

@Enum("test")
export class TestMemberPermission extends Permission(EntityType.Member) {
    static readonly Test1 = new TestMemberPermission();
    static readonly Test2 = new TestMemberPermission();
    static readonly Test3 = new TestMemberPermission();
}

@Enum("test")
export class TestUserRole extends Role(EntityType.User) {
    static readonly Test1 = new TestUserRole();
    static readonly Test2 = new TestUserRole();
}

@Enum("test")
export class TestMemberRole extends Role(EntityType.Member) {
    static readonly Test1 = new TestMemberRole();
    static readonly Test2 = new TestMemberRole();
}
