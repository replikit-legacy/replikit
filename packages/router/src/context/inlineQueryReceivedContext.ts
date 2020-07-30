import { AccountContext } from "@replikit/router";
import { InlineQueryReceivedEvent, InlineQuery, InlineQueryResponse } from "@replikit/core/typings";

export class InlineQueryReceivedContext extends AccountContext<InlineQueryReceivedEvent> {
    get query(): InlineQuery {
        return this.payload.query;
    }

    answer(response: InlineQueryResponse): Promise<void> {
        return this.controller.answerInlineQuery(this.query.id, response);
    }
}
