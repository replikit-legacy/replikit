import { fromText } from "@replikit/messages";
import { OutMessageLike } from "@replikit/messages/typings";
import { prop, View, ViewMessageBuilder } from "@replikit/views";

export class ConfirmationView extends View {
    text = prop("Подтвердите");
    buttonText = prop("Подтвердить");
    confirmedText = prop("Подтверждено");

    authenticate = true;

    patterns = {
        close: /(да|подтверждаю|подтвердить)/i
    };

    render(): OutMessageLike {
        return new ViewMessageBuilder() //
            .addText(this.text)
            .addAction(this.buttonText, "close");
    }

    renderClosed(): OutMessageLike {
        return fromText(this.confirmedText);
    }

    renderTextFallback(): OutMessageLike {
        return fromText("Вы подтверждаете?");
    }
}
