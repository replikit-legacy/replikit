import { Command } from "@replikit/commands";
import { BetUserSession } from "@example/darts";
import { fromCode } from "@replikit/messages";
import { BankingUserExtension } from "@example/banking";
import { CommandResult } from "@replikit/commands/typings";

export class UnbetCommand extends Command {
    name = "unbet";

    async execute(): Promise<CommandResult> {
        const session = await this.getSession(BetUserSession);
        if (session.activeBet === undefined) {
            return fromCode("У вас нет активной ставки");
        }

        const user = await this.getUser(BankingUserExtension);
        user.banking.money += session.activeBet;
        await user.save();

        session.activeBet = undefined;
        return fromCode("Ставка отменена");
    }
}
