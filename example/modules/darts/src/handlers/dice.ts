import { router } from "@replikit/router";
import { connection } from "@replikit/storage";
import { DartThrow, addUserStats, betStorage } from "@example/darts";
import { MessageBuilder } from "@replikit/messages";

router.of("message:received").use(async (context, next) => {
    const dice = context.message.telegram?.dice;
    if (!dice) {
        return next();
    }

    const user = await context.getUser();
    const collection = connection.getRepository(DartThrow);

    const dartThrow = collection.create({
        date: new Date(),
        emoji: dice.emoji,
        value: dice.value,
        userId: user._id
    });
    await dartThrow.save();

    user.banking.money += dice.value;
    user.darts.sum += dice.value;
    user.darts.total += 1;
    user.darts.average = user.darts.sum / user.darts.total;
    await user.save();

    const builder = new MessageBuilder()
        .addCodeLine(`Результат: ${dice.value}`)
        .addCodeLine(`Вы получили ${dice.value} нихуя`)
        .addCodeLine(`Ваш баланс: ${user.banking.money} нихуя`);
    addUserStats(builder, user, context.t.darts);
    await context.reply(builder);

    const bet = betStorage.getBet(user._id);
    if (bet === undefined) {
        return;
    }

    if (dice.value > 3) {
        user.banking.money += bet * 2;
        const builder = new MessageBuilder()
            .addCodeLine(`Ваш выигрыш: ${bet * 2} нихуя`)
            .addCodeLine(`Ваш баланс: ${user.banking.money} нихуя`);
        await user.save();
        await context.reply(builder);
    } else {
        const builder = new MessageBuilder()
            .addCodeLine(`Вы проиграли ${bet} нихуя`)
            .addCodeLine(`Ваш баланс: ${user.banking.money} нихуя`);
        await context.reply(builder);
    }
});
