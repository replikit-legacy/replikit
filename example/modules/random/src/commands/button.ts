import { Command } from "@replikit/commands";
import { CommandResult } from "@replikit/commands/typings";
import { MessageBuilder } from "@replikit/messages";

export class ButtonCommand extends Command {
    name = "button";

    execute(): CommandResult {
        return new MessageBuilder()
            .addCodeLine("Test")
            .addButton({ text: "Test", payload: "test" })
            .addButton({ text: "Switch inline", switchInline: { current: true, username: "" } });
    }
}
