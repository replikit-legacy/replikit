import { OutMessage } from "@replikit/core/typings";
import { MessageBuilder } from "@replikit/messages";
import { ViewAction } from "@replikit/views/typings";

interface ViewBuilderAction {
    row?: number;
    text: string;
    action: string;
    args: unknown[];
}

export class ViewMessageBuilder extends MessageBuilder {
    actions: ViewBuilderAction[] = [];

    addAction(row: number, text: string, action: string, ...args: unknown[]): this;
    addAction(text: string, action: string, ...args: unknown[]): this;

    addAction(
        rowOrText: string | number,
        textOrAction: string,
        action?: string,
        ...args: unknown[]
    ): this {
        const row = typeof rowOrText === "number" ? rowOrText : undefined;
        const text = typeof rowOrText === "string" ? rowOrText : textOrAction;
        this.actions.push({
            row,
            text,
            action: row ? action! : textOrAction,
            args: row ? args : [action, ...args]
        });
        return this;
    }

    buildWithActions(view: string): [OutMessage, ViewAction[]] {
        const actions: ViewAction[] = [];
        for (const [index, action] of this.actions.entries()) {
            const button = { text: action.text, payload: JSON.stringify({ view, action: index }) };
            if (action.row) {
                this.addButton(action.row, button);
            } else {
                this.addButton(button);
            }
            actions.push({ name: action.action, arguments: action.args });
        }
        const result = this.build();
        return [result, actions];
    }
}
