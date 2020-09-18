import { ConfirmationView } from "@example/random";
import { command } from "@replikit/commands";
import { CommandContext } from "@replikit/commands/typings";
import { useOptional } from "@replikit/hooks";

command("confirmation").handler(handler).register();

async function handler(context: CommandContext): Promise<void> {
    const text = useOptional("text", String);
    const buttonText = useOptional("buttonText", String);
    const confirmedText = useOptional("confirmedText", String);

    return context.enter(ConfirmationView, { text, buttonText, confirmedText });
}
