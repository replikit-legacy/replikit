import { command } from "@replikit/commands";
import { fromCode, MessageBuilder } from "@replikit/messages";
import { User } from "@replikit/storage";
import { logger } from "@example/banking";

command("money", "банк")
    .default("balance")
    .commands(
        command("balance", "баланс").handler(async context => {
            const user = await context.getUser();
            return fromCode(`Ваш баланс: ${user.banking.money} нихуя`);
        }),
        command("transfer", "перевести")
            .required("user", User)
            .required("amount", Number, { positive: true })
            .handler(async context => {
                const user = await context.getUser();
                if (user._id === context.params.user._id) {
                    return fromCode("Вы не можете совершить перевод себе");
                }

                if (user.banking.money < context.params.amount) {
                    return new MessageBuilder()
                        .addCodeLine("Недостаточно средств")
                        .addCodeLine(`Ваш баланс: ${user.banking.money} нихуя`);
                }

                const targetUser = context.params.user;
                targetUser.banking.money += context.params.amount;
                user.banking.money -= context.params.amount;

                await targetUser.save();
                await user.save();

                const logMessage = [
                    "Transfer successfuly completed: ",
                    `${user.username} -> ${targetUser.username} `,
                    `Amount: ${context.params.amount}`
                ].join("");
                logger.info(logMessage);

                return fromCode("Операция успешно завершена");
            })
    )
    .register();
