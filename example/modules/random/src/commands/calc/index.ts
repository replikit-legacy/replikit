import { CommandContainer } from "@replikit/commands";
import { MulCommand } from "./mul";
import { SumCommand } from "./sum";

export class CalcCommand extends CommandContainer {
    name = "calc";

    commands = [SumCommand, MulCommand];
}
