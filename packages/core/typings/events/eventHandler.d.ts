import {
    EventMap,
    ChannelEventPayload,
    AccountEventPayload,
    MessageEventPayload,
    ChannelPhotoEventPayload
} from "@replikit/core/typings";

export type EventName = keyof EventMap;

export type ExtractEventName<V> = keyof Pick<
    EventMap,
    { [K in keyof EventMap]: EventMap[K] extends V ? K : never }[keyof EventMap]
>;

export type ChannelEventName = ExtractEventName<ChannelEventPayload>;
export type ChannelPhotoEventName = ExtractEventName<ChannelPhotoEventPayload>;
export type AccountEventName = ExtractEventName<AccountEventPayload>;
export type MessageEventName = ExtractEventName<MessageEventPayload>;

export interface Event<T extends EventName = EventName> {
    type: T;
    payload: EventMap[T];
}

export type ChannelEvent = Event<ChannelEventName>;
export type ChannelPhotoEvent = Event<ChannelPhotoEventName>;
export type AccountEvent = Event<AccountEventName>;
export type MessageEvent = Event<MessageEventName>;

export type EventHandler<T extends EventName = EventName> = (event: Event<T>) => void;
