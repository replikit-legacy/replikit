import {
    MessageEventPayload,
    AccountEventPayload,
    ChannelEventPayload,
    ChannelPhotoEventPayload
} from "@replikit/core/typings";

export interface EventMap {
    "message:received": MessageEventPayload;
    "message:edited": MessageEventPayload;
    "message:deleted": MessageEventPayload;
    "account:joined": AccountEventPayload;
    "account:left": AccountEventPayload;
    "channel:title:edited": ChannelEventPayload;
    "channel:photo:edited": ChannelPhotoEventPayload;
    "channel:photo:deleted": ChannelEventPayload;
}
