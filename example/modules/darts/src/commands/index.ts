import { commands } from "@replikit/commands";
import { BetCommand } from "./bet";
import { UnbetCommand } from "./unbet";
import { ThrowsCommand } from "./throws";

commands.register(BetCommand);
commands.register(UnbetCommand);
commands.register(ThrowsCommand);
