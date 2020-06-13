import { command } from "@replikit/commands";
import { fromCode } from "@replikit/messages";

command("calc")
    .commands(
        command("sum")
            .rest("numbers", Number, { minCount: 2, float: true })
            .handler(context => {
                const result = context.params.numbers.reduce((a, b) => a + b);
                return fromCode(`Result: ${result}`);
            }),
        command("mul")
            .rest("numbers", Number, { minCount: 2, float: true })
            .handler(context => {
                const result = context.params.numbers.reduce((a, b) => a * b);
                return fromCode(`Result: ${result}`);
            })
    )
    .register();
