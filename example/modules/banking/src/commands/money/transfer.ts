import { fromCode, MessageBuilder } from "@replikit/messages";
import { User } from "@replikit/storage";
import { command } from "@replikit/commands";
import { useRequired } from "@replikit/hooks";
import { logger } from "@example/banking";
import { CommandContext, CommandResult } from "@replikit/commands/typings";

export const transfer = command("transfer", "перевести")
    .handler(handler)
    .build();

async function handler(context: CommandContext): Promise<CommandResult> {
    const targetUser = useRequired("user", User);
    const amount = useRequired("amount", Number, { positive: true });

    const user = await context.getUser();
    if (user._id === targetUser._id) {
        return fromCode("Вы не можете совершить перевод себе");
    }

    if (user.banking.money < amount) {
        return new MessageBuilder()
            .addCodeLine("Недостаточно средств")
            .addCodeLine(`Ваш баланс: ${user.banking.money} нихуя`);
    }

    targetUser.banking.money += amount;
    user.banking.money -= amount;

    await targetUser.save();
    await user.save();

    const logMessage = [
        "Transfer successfuly completed: ",
        `${user.username} -> ${targetUser.username} `,
        `Amount: ${amount}`
    ].join("");
    logger.info(logMessage);

    return fromCode("Операция успешно завершена");
}
