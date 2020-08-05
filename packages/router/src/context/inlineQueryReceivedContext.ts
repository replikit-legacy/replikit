import { AccountContext } from "@replikit/router";
import { InlineQueryReceivedContext as _InlineQueryReceivedContext } from "@replikit/router/typings";
import { InlineQueryReceivedEvent, InlineQuery, InlineQueryResponse } from "@replikit/core/typings";

export class InlineQueryReceivedContext extends AccountContext<InlineQueryReceivedEvent> {
    get query(): InlineQuery {
        return this.payload.query;
    }

    answer(response: InlineQueryResponse): Promise<void> {
        return this.controller.answerInlineQuery(this.query.id, response);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InlineQueryReceivedContext extends _InlineQueryReceivedContext {}
