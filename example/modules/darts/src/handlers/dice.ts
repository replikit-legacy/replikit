import { router } from "@replikit/router";
import { connection } from "@replikit/storage";
import { DartThrow, addUserStats, DartsLocale, BetUserSession } from "@example/darts";
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

    const locale = context.getLocale(DartsLocale);
    const builder = new MessageBuilder()
        .addReply(context.message.metadata)
        .addCodeLine(`Результат: ${dice.value}`)
        .addCodeLine(`Вы получили ${dice.value} нихуя`)
        .addCodeLine(`Ваш баланс: ${user.banking.money} нихуя`);
    addUserStats(builder, user, locale);
    await context.reply(builder);

    const session = await context.getSession(BetUserSession);
    // eslint-disable-next-line eqeqeq
    if (!session.activeBet) {
        return;
    }

    if (dice.value > 3) {
        const prize = session.activeBet * 2;
        user.banking.money += prize;
        const builder = new MessageBuilder()
            .addReply(context.message.metadata)
            .addCodeLine(`Ваш выигрыш: ${prize} нихуя`)
            .addCodeLine(`Ваш баланс: ${user.banking.money} нихуя`);
        await user.save();
        await context.reply(builder);
    } else {
        const builder = new MessageBuilder()
            .addReply(context.message.metadata)
            .addCodeLine(`Вы проиграли ${session.activeBet} нихуя`)
            .addCodeLine(`Ваш баланс: ${user.banking.money} нихуя`);
        await context.reply(builder);
    }

    session.activeBet = undefined;
});
