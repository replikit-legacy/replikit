import { SafeFunction } from "@replikit/core/typings";
import { OutMessageLikeAsync } from "@replikit/messages/typings";
import { ViewField } from "@replikit/views";

export type ViewRenderer = () => OutMessageLikeAsync;

export interface ViewInfoPrototype {
    [key: string]: SafeFunction;
    render: ViewRenderer;
}

export interface ViewInfo {
    fields: ViewField[];
    prototype: ViewInfoPrototype;
}
