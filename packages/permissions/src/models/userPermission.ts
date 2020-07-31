import { PermissionInstance, EntityType } from "@replikit/permissions";

export class UserPermission extends PermissionInstance<typeof EntityType.User> {}
