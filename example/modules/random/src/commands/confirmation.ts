import { ConfirmationView } from "@example/random";
import { Command, optional } from "@replikit/commands";
import { User } from "@replikit/storage";

export class ConfirmationCommand extends Command {
    name = "confirmation";

    text = optional(String);
    buttonText = optional(String);
    confirmedText = optional(String);
    user = optional(User);

    execute(): void {
        const { text, buttonText, confirmedText, user } = this;
        const account = user ? user.getAccount(this.controller.name) ?? user.account : undefined;
        const target = account && { controller: account.controller, accountId: account.localId };
        void this.enter(ConfirmationView, { text, buttonText, confirmedText }, target);
    }
}
