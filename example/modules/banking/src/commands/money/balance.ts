import { command } from "@replikit/commands";
import { fromCode, MessageLike } from "@replikit/messages";
import { MessageContext } from "@replikit/router";

export const balance = command("balance", "баланс")
    .handler(handler)
    .build();

async function handler(context: MessageContext): Promise<MessageLike> {
    const user = await context.getUser();
    return fromCode(`Ваш баланс: ${user.banking.money} нихуя`);
}
