import { CounterView } from "@example/random";
import { command } from "@replikit/commands";
import { CommandContext } from "@replikit/commands/typings";
import { useOptional } from "@replikit/hooks";

command("counter").handler(handler).register();

function handler(context: CommandContext): Promise<void> {
    const initial = useOptional("initial", Number, { min: -10000, max: 10000 });
    const step = useOptional("step", Number, { min: -1000, max: 1000 });

    return context.enter(CounterView, { initial, step });
}
