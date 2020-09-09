import { command } from "@replikit/commands";
import { CommandContext, CommandResult } from "@replikit/commands/typings";
import { MessageBuilder } from "@replikit/messages";

command("avatar")
    .handler(handler)
    .register();

function handler(context: CommandContext): CommandResult {
    const avatarAttachment = context.account.avatar;
    if (avatarAttachment) {
        return new MessageBuilder().addAttachment(avatarAttachment);
    }
}
