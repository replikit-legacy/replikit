import { CommandContext } from "@replikit/commands/typings";
import { OutMessageLike } from "@replikit/messages/typings";

export type CommandResult = void | OutMessageLike;

type CommandResultAsync = CommandResult | Promise<CommandResult>;

export type CommandHandler<C = CommandContext> = (context: C) => CommandResultAsync;
