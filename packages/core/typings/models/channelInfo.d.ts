import { HasId, ChannelPermissionMap } from "@replikit/core/typings";
import { ChannelType } from "@replikit/core";

export interface ChannelInfo extends HasId {
    title?: string;
    permissions: ChannelPermissionMap;
    type: ChannelType;
}
