import { ConfirmationView } from "@example/random";
import { Command, optional } from "@replikit/commands";

export class ConfirmationCommand extends Command {
    name = "confirmation";

    text = optional(String);
    buttonText = optional(String);
    confirmedText = optional(String);

    execute(): void {
        const { text, buttonText, confirmedText } = this;
        void this.enter(ConfirmationView, { text, buttonText, confirmedText });
    }
}
