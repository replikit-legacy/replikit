import { fromCode } from "@replikit/messages";
import { OutMessageLike } from "@replikit/messages/typings";
import { prop, View, ViewMessageBuilder } from "@replikit/views";

export class ConfirmationView extends View {
    text = prop("Подтвердите");
    buttonText = prop("Подтвердить");
    confirmedText = prop("Подтверждено");

    render(): OutMessageLike {
        if (this.closed) {
            return fromCode(this.confirmedText);
        }
        return new ViewMessageBuilder() //
            .addCode(this.text)
            .addAction(this.buttonText, "close");
    }
}
