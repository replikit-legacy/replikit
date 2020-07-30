import { ChannelInfo, EventPayload } from "@replikit/core/typings";

export interface ChannelEventPayload extends EventPayload {
    channel: ChannelInfo;
}
