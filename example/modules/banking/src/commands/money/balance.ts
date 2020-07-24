import { command } from "@replikit/commands";
import { fromCode } from "@replikit/messages";
import { CommandContext, CommandResult } from "@replikit/commands/typings";

export const balance = command("balance", "баланс")
    .handler(handler)
    .build();

async function handler(context: CommandContext): Promise<CommandResult> {
    const user = await context.getUser();
    return fromCode(`Ваш баланс: ${user.banking.money} нихуя`);
}
