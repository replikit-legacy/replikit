import { ChannelEventPayload, AccountEventPayload } from "@replikit/core/typings";

export interface MemberEventPayload extends ChannelEventPayload, AccountEventPayload {}
