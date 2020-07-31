import { RoleInstance, EntityType } from "@replikit/permissions";

export class MemberRole extends RoleInstance<typeof EntityType.Member> {}
