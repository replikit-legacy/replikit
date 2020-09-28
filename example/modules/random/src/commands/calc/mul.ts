import { fromCode } from "@replikit/messages";
import { Command, rest } from "@replikit/commands";
import { CommandResult } from "@replikit/commands/typings";

export class MulCommand extends Command {
    name = "mul";

    numbers = rest(Number, { minCount: 2, float: true });

    execute(): CommandResult {
        const result = this.numbers.reduce((a, b) => a * b);
        return fromCode(`Result: ${result}`);
    }
}
