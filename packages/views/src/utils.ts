import { HasFields, InMessage, OutMessage } from "@replikit/core/typings";
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
    outMessage: OutMessageLike,
    skipActions?: boolean
): [OutMessage, ViewAction[]] {
    if (!skipActions && outMessage instanceof ViewMessageBuilder) {
        return outMessage.buildWithActions(view);
    }
    return [resolveOutMessage(outMessage), []];
}

export type PatternHandler = (message: InMessage) => boolean;

export type ViewPattern = string | RegExp | string[] | RegExp[] | PatternHandler;

function checkSinglePattern(
    message: InMessage,
    pattern: string | RegExp | PatternHandler
): boolean {
    switch (typeof pattern) {
        case "string":
            return message.text ? message.text.includes(pattern) : false;
        case "function":
            return pattern(message);
    }
    return message.text ? pattern.test(message.text) : false;
}

export function checkPattern(message: InMessage, pattern: ViewPattern): boolean {
    if (Array.isArray(pattern)) {
        return pattern.some((x: string | RegExp) => checkSinglePattern(message, x));
    }
    return checkSinglePattern(message, pattern);
}

export function checkViewTarget(context: AccountContext, target: ViewTarget | undefined): boolean {
    if (!target) {
        return true;
    }
    return context.controller.name === target.controller && context.account.id === target.accountId;
}
