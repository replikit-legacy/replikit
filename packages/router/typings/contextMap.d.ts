import {
    MessageContext,
    ChannelContext,
    MemberContext,
    InlineQueryReceivedContext,
    InlineQueryChosenContext
} from "@replikit/router";
import { ChannelPhotoEvent } from "@replikit/core/typings";

export interface ContextMap {
    "message:received": MessageContext;
    "message:edited": MessageContext;
    "message:deleted": MessageContext;
    "member:joined": MemberContext;
    "member:left": MemberContext;
    "channel:title:edited": ChannelContext;
    "channel:photo:edited": ChannelContext<ChannelPhotoEvent>;
    "channel:photo:deleted": ChannelContext;
    "inline-query:received": InlineQueryReceivedContext;
    "inline-query:chosen": InlineQueryChosenContext;
}
