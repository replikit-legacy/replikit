import { fromCode } from "@replikit/messages";
import { useRest } from "@replikit/hooks";
import { command } from "@replikit/commands";
import { CommandResult } from "@replikit/commands/typings";

export const sum = command("sum")
    .handler(handler)
    .build();

function handler(): CommandResult {
    const numbers = useRest("numbers", Number, { minCount: 2, float: true });
    const result = numbers.reduce((a, b) => a + b);
    return fromCode(`Result: ${result}`);
}
