import { CommandContext } from "@replikit/commands/typings";
import { OutMessage } from "@replikit/core/typings";
import { MessageBuilder } from "@replikit/messages";

export type CommandResult = void | OutMessage | MessageBuilder;

type AsyncCommandResult = CommandResult | Promise<CommandResult>;

export type CommandHandler<C = CommandContext> = (context: C) => AsyncCommandResult;
