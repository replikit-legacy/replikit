import { OutMessage } from "@replikit/core/typings";
import { MessageBuilder } from "@replikit/messages";

interface ViewAction {
    text: string;
    action: string;
}

export class ViewMessageBuilder extends MessageBuilder {
    actions: ViewAction[] = [];

    addAction(text: string, action: string): this {
        this.actions.push({ text, action });
        return this;
    }

    buildWithActions(view: string): [OutMessage, string[]] {
        const result = this.build();
        const buttons = this.actions.map(x => ({
            text: x.text,
            payload: JSON.stringify({ view, action: x.action })
        }));
        result.buttons.push(...buttons);
        return [result, this.actions.map(x => x.action)];
    }
}
