import { HasFields, OutMessage } from "@replikit/core/typings";
import { resolveOutMessage } from "@replikit/messages";
import { OutMessageLike } from "@replikit/messages/typings";
import { ViewMessageBuilder } from "@replikit/views";

export function parseJSON(json: string): HasFields | undefined {
    try {
        return JSON.parse(json) as HasFields;
    } catch (e) {
        return;
    }
}

export interface ViewPayload {
    view: string;
    action: string;
}

export function isViewPayload(data: unknown): data is ViewPayload {
    return "view" in (data as HasFields) && "action" in (data as HasFields);
}

export function resolveViewOutMessage(
    view: string,
    outMessage: OutMessageLike
): [OutMessage, string[]?] {
    if (outMessage instanceof ViewMessageBuilder) {
        return outMessage.buildWithActions(view);
    }
    return [resolveOutMessage(outMessage)];
}
