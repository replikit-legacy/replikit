import { AccountEventPayload, ChosenInlineQueryResult } from "@replikit/core/typings";

export interface InlineQueryChosenEventPayload extends AccountEventPayload {
    result: ChosenInlineQueryResult;
}
