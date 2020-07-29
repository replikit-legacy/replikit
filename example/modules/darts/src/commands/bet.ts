import { command } from "@replikit/commands";
import { fromCode } from "@replikit/messages";
import { BetUserSession } from "@example/darts";
import { useRequired } from "@replikit/hooks";
import { CommandContext, CommandResult } from "@replikit/commands/typings";
import { BankingUserExtension } from "@example/banking";

command("bet")
    .handler(handler)
    .register();

async function handler(context: CommandContext): Promise<CommandResult> {
    const amount = useRequired("amount", Number, { positive: true });

    const session = await context.getSession(BetUserSession);
    if (session.activeBet) {
        return fromCode("У вас уже есть активная ставка");
    }

    const user = await context.getUser(BankingUserExtension);
    if (user.banking.money < amount) {
        return fromCode("Недостаточно средств");
    }
    user.banking.money -= amount;
    await user.save();

    session.activeBet = amount;
    return fromCode("Ставка принята");
}
