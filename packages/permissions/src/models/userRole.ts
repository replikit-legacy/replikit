import { RoleInstance, EntityType } from "@replikit/permissions";

export class UserRole extends RoleInstance<typeof EntityType.User> {}
