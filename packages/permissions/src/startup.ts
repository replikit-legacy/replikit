import { applyMixins } from "@replikit/core";
import { User, Member } from "@replikit/storage";
import { HasPermissions } from "@replikit/permissions";

applyMixins(User, [HasPermissions]);
applyMixins(Member, [HasPermissions]);
