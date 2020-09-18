import { OutMessageLike } from "@replikit/messages/typings";
import { prop, state, View, ViewMessageBuilder } from "@replikit/views";

export class CounterView extends View {
    initial = prop(0);
    step = prop(1);
    count = state(this.initial);

    increment(): void {
        this.count += this.step;
        this.update();
    }

    render(): OutMessageLike {
        return new ViewMessageBuilder()
            .addCodeLine(`Count: ${this.count}`)
            .addCodeLine(`Last user: ${this.account.username}`)
            .addAction("Increment", "increment");
    }
}
