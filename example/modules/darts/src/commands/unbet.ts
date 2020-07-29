import { command } from "@replikit/commands";
import { BetUserSession } from "@example/darts";
import { fromCode } from "@replikit/messages";
import { CommandContext, CommandResult } from "@replikit/commands/typings";
import { BankingUserExtension } from "@example/banking";

command("unbet")
    .handler(handler)
    .register();

async function handler(context: CommandContext): Promise<CommandResult> {
    const session = await context.getSession(BetUserSession);
    if (session.activeBet === undefined) {
        return fromCode("У вас нет активной ставки");
    }

    const user = await context.getUser(BankingUserExtension);
    user.banking.money += session.activeBet;
    await user.save();

    session.activeBet = undefined;
    return fromCode("Ставка отменена");
}
