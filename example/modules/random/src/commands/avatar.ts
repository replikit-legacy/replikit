import { Command } from "@replikit/commands";
import { CommandResult } from "@replikit/commands/typings";
import { MessageBuilder } from "@replikit/messages";
import { member } from "@replikit/storage";

export class AvatarCommand extends Command {
    name = "avatar";

    member = member();

    execute(): CommandResult {
        const avatarAttachment = this.account.avatar;
        if (avatarAttachment) {
            return new MessageBuilder().addAttachment(avatarAttachment);
        }
    }
}
