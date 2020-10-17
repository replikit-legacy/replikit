import { HasFields, OutMessage } from "@replikit/core/typings";
import { resolveOutMessage } from "@replikit/messages";
import { OutMessageLike } from "@replikit/messages/typings";
import { AccountContext } from "@replikit/router";
import { ViewMessageBuilder } from "@replikit/views";
import { ViewAction, ViewTarget } from "@replikit/views/typings";

export function parseJSON(json: string): HasFields | undefined {
    try {
        return JSON.parse(json) as HasFields;
    } catch (e) {
        return;
    }
}

export interface ViewPayload {
    view: string;
    action: number;
}

export function isViewPayload(data: unknown): data is ViewPayload {
    return "view" in (data as HasFields) && "action" in (data as HasFields);
}

export function resolveViewOutMessage(
    view: string,
    outMessage: OutMessageLike
): [OutMessage, ViewAction[]] {
    if (outMessage instanceof ViewMessageBuilder) {
        return outMessage.buildWithActions(view);
    }
    return [resolveOutMessage(outMessage), []];
}

export type ViewPattern = string | RegExp | string[] | RegExp[];

function checkSinglePattern(text: string, pattern: string | RegExp): boolean {
    return typeof pattern === "string" ? text.includes(pattern) : pattern.test(text);
}

export function checkPattern(text: string, pattern: ViewPattern): boolean {
    if (Array.isArray(pattern)) {
        return pattern.some((x: string | RegExp) => checkSinglePattern(text, x));
    }
    return checkSinglePattern(text, pattern);
}

export function checkViewTarget(context: AccountContext, target: ViewTarget | undefined): boolean {
    if (!target) {
        return true;
    }
    return context.controller.name === target.controller && context.account.id === target.accountId;
}
