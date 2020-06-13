import {
    MessageContext,
    AccountContext,
    ChannelContext
} from "@replikit/router";
import { ChannelPhotoEvent } from "@replikit/core/typings";

export interface ContextMap {
    "message:received": MessageContext;
    "message:edited": MessageContext;
    "message:deleted": MessageContext;
    "account:joined": AccountContext;
    "account:left": AccountContext;
    "channel:title:edited": ChannelContext;
    "channel:photo:edited": ChannelContext<ChannelPhotoEvent>;
    "channel:photo:deleted": ChannelContext;
}
