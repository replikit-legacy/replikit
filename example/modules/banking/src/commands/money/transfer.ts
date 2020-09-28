import { fromCode, MessageBuilder } from "@replikit/messages";
import { User, loadExtensions } from "@replikit/storage";
import { Command, required } from "@replikit/commands";
import { logger, BankingUserExtension } from "@example/banking";
import { CommandResult } from "@replikit/commands/typings";

export class TransferCommand extends Command {
    name = "transfer";
    aliases = ["перевести"];

    user = required(User);
    amount = required(Number, { positive: true });

    async execute(): Promise<CommandResult> {
        const { user: targetUser, amount } = this;

        loadExtensions(targetUser, BankingUserExtension);

        const user = await this.getUser(BankingUserExtension);
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
}
