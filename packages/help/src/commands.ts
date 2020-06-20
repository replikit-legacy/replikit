import { command, commands } from "@replikit/commands";
import { descriptions } from "@replikit/help";
import { fromCode } from "@replikit/messages";

command("help")
    .handler(context => {
        const message = descriptions.render(
            commands.getCommands(),
            context.account.language
        );
        return fromCode(message);
    })
    .register();
