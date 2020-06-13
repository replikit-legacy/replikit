import { command } from "@replikit/commands";
import { fromCode } from "@replikit/messages";
import { betStorage } from "@example/darts";

command("bet")
    .required("amount", Number, { positive: true })
    .handler(async context => {
        const user = await context.getUser();
        if (user.banking.money < context.params.amount) {
            return fromCode("Недостаточно средств");
        }
        const ok = betStorage.bet(user._id, context.params.amount);
        if (!ok) {
            return fromCode("У вас уже есть активная ставка");
        }
        user.banking.money -= context.params.amount;
        await user.save();
        return fromCode("Ставка принята");
    })
    .register();

command("unbet")
    .handler(async context => {
        const user = await context.getUser();
        const bet = betStorage.getBet(user._id);
        if (bet === undefined) {
            return fromCode("У вас нет активной ставки");
        }
        user.banking.money += bet;
        await user.save();
        return fromCode("Ставка отменена");
    })
    .register();
