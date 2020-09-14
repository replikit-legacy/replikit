import {
    EventMap,
    ChannelEventPayload,
    MemberEventPayload,
    MessageEventPayload,
    ChannelPhotoEventPayload,
    AccountEventPayload,
    InlineQueryReceivedEventPayload,
    InlineQueryChosenEventPayload,
    ButtonEventPayload
} from "@replikit/core/typings";

export type EventName = keyof EventMap;

export type ExtractEventName<V> = keyof Pick<
    EventMap,
    { [K in keyof EventMap]: EventMap[K] extends V ? K : never }[keyof EventMap]
>;

export type ChannelEventName = ExtractEventName<ChannelEventPayload>;
export type ChannelPhotoEventName = ExtractEventName<ChannelPhotoEventPayload>;
export type MemberEventName = ExtractEventName<MemberEventPayload>;
export type MessageEventName = ExtractEventName<MessageEventPayload>;
export type AccountEventName = ExtractEventName<AccountEventPayload>;
export type InlineQueryReceivedEventName = ExtractEventName<InlineQueryReceivedEventPayload>;
export type InlineQueryChosenEventName = ExtractEventName<InlineQueryChosenEventPayload>;
export type ButtonEventName = ExtractEventName<ButtonEventPayload>;

export interface Event<T extends EventName = EventName> {
    type: T;
    payload: EventMap[T];
}

export type ChannelEvent = Event<ChannelEventName>;
export type ChannelPhotoEvent = Event<ChannelPhotoEventName>;
export type MemberEvent = Event<MemberEventName>;
export type AccountEvent = Event<AccountEventName>;
export type MessageEvent = Event<MessageEventName>;
export type InlineQueryReceivedEvent = Event<InlineQueryReceivedEventName>;
export type InlineQueryChosenEvent = Event<InlineQueryChosenEventName>;
export type ButtonEvent = Event<ButtonEventName>;

export type EventHandler<T extends EventName = EventName> = (event: Event<T>) => void;
