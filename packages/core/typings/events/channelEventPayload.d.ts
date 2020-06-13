import { ChannelInfo } from "@replikit/core/typings";
import { Controller } from "@replikit/core";

export interface ChannelEventPayload {
    channel: ChannelInfo;
    controller: Controller;
}
