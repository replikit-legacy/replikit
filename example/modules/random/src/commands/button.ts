import { command } from "@replikit/commands";
import { CommandResult } from "@replikit/commands/typings";
import { MessageBuilder } from "@replikit/messages";

command("button").handler(handler).register();

function handler(): CommandResult {
    return new MessageBuilder().addCodeLine("Test").addButtonWithPayload("Test", "test");
}
