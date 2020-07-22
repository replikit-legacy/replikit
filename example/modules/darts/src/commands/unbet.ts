import { command } from "@replikit/commands";
import { MessageContext } from "@replikit/router";
import { BetUserSession } from "@example/darts";
import { fromCode, MessageLike } from "@replikit/messages";

command("unbet")
    .handler(handler)
    .register();

async function handler(context: MessageContext): Promise<MessageLike> {
    const session = await context.getSession(BetUserSession);
    if (session.activeBet === undefined) {
        return fromCode("У вас нет активной ставки");
    }

    const user = await context.getUser();
    user.banking.money += session.activeBet;
    await user.save();

    session.activeBet = undefined;
    return fromCode("Ставка отменена");
}
