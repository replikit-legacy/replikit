import { Command } from "@replikit/commands";
import { fromCode } from "@replikit/messages";
import { BankingUserExtension } from "@example/banking";
import { CommandResult } from "@replikit/commands/typings";

export class BalanceCommand extends Command {
    name = "balance";
    aliases = ["баланс"];

    async execute(): Promise<CommandResult> {
        const user = await this.getUser(BankingUserExtension);
        return fromCode(`Ваш баланс: ${user.banking.money} нихуя`);
    }
}
