import { Command, required } from "@replikit/commands";
import { fromCode } from "@replikit/messages";
import { BetUserSession } from "@example/darts";
import { BankingUserExtension } from "@example/banking";
import { CommandResult } from "@replikit/commands/typings";

export class BetCommand extends Command {
    name = "bet";

    amount = required(Number, { positive: true });

    async execute(): Promise<CommandResult> {
        const { amount } = this;

        const session = await this.getSession(BetUserSession);
        if (session.activeBet) {
            return fromCode("У вас уже есть активная ставка");
        }

        const user = await this.getUser(BankingUserExtension);
        if (user.banking.money < amount) {
            return fromCode("Недостаточно средств");
        }
        user.banking.money -= amount;
        await user.save();

        session.activeBet = amount;
        return fromCode("Ставка принята");
    }
}
