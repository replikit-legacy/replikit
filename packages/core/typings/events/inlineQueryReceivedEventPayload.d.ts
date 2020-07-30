import { AccountEventPayload, InlineQuery } from "@replikit/core/typings";

export interface InlineQueryReceivedEventPayload extends AccountEventPayload {
    query: InlineQuery;
}
