import { CounterView } from "@example/random";
import { Command, optional } from "@replikit/commands";

export class CounterCommand extends Command {
    name = "counter";

    initial = optional(Number, { min: -10000, max: 10000 });
    step = optional(Number, { min: -1000, max: 1000 });

    execute(): void {
        const { initial, step } = this;
        void this.enter(CounterView, { initial, step });
    }
}
