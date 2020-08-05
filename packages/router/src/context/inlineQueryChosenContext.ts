import { AccountContext } from "@replikit/router";
import { InlineQueryChosenContext as _InlineQueryChosenContext } from "@replikit/router/typings";
import { InlineQueryChosenEvent, ChosenInlineQueryResult } from "@replikit/core/typings";

export class InlineQueryChosenContext extends AccountContext<InlineQueryChosenEvent> {
    get result(): ChosenInlineQueryResult {
        return this.payload.result;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InlineQueryChosenContext extends _InlineQueryChosenContext {}
