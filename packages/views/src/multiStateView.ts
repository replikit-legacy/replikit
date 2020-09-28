import { OutMessageLikeAsync } from "@replikit/messages/typings";
import { state, View } from "@replikit/views";

export abstract class MultiStateView extends View {
    abstract initial: string;

    currentState = state<string>();

    changeState(name: string): void {
        this.currentState = name;
        this.update();
    }

    render(): OutMessageLikeAsync {
        if (!this.currentState) {
            this.currentState = this.initial;
        }
        return this._invoke(this.currentState) as OutMessageLikeAsync;
    }
}
