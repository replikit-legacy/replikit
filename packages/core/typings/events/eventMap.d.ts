import {
    MessageEventPayload,
    MemberEventPayload,
    ChannelEventPayload,
    ChannelPhotoEventPayload,
    InlineQueryReceivedEventPayload,
    InlineQueryChosenEventPayload
} from "@replikit/core/typings";

export interface EventMap {
    "message:received": MessageEventPayload;
    "message:edited": MessageEventPayload;
    "message:deleted": MessageEventPayload;
    "member:joined": MemberEventPayload;
    "member:left": MemberEventPayload;
    "channel:title:edited": ChannelEventPayload;
    "channel:photo:edited": ChannelPhotoEventPayload;
    "channel:photo:deleted": ChannelEventPayload;
    "inline-query:received": InlineQueryReceivedEventPayload;
    "inline-query:chosen": InlineQueryChosenEventPayload;
}
