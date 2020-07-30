import { AccountContext } from "@replikit/router";
import { InlineQueryChosenEvent, ChosenInlineQueryResult } from "@replikit/core/typings";

export class InlineQueryChosenContext extends AccountContext<InlineQueryChosenEvent> {
    get result(): ChosenInlineQueryResult {
        return this.payload.result;
    }
}
