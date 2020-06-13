import { CommandContext } from "@replikit/commands/typings";
import { OutMessage } from "@replikit/core/typings";
import { MessageBuilder } from "@replikit/messages";

export type CommandResult =
    | void
    | OutMessage
    | MessageBuilder
    | Promise<void | OutMessage | MessageBuilder>;

export type CommandHandler<C = CommandContext> = (context: C) => CommandResult;
