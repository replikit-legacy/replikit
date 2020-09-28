import { CommandContainer } from "@replikit/commands";
import { BalanceCommand } from "./balance";
import { TransferCommand } from "./transfer";

export class MoneyCommand extends CommandContainer {
    name = "money";
    aliases = ["банк"];
    default = "balance";

    commands = [BalanceCommand, TransferCommand];
}
