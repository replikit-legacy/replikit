import { commands } from "@replikit/commands";

import { AvatarCommand } from "./avatar";
import { ButtonCommand } from "./button";
import { ConfirmationCommand } from "./confirmation";
import { CounterCommand } from "./counter";
import { DeleteCommand } from "./delete";
import { EchoCommand } from "./echo";
import { EditCommand } from "./edit";
import { FormatCommand } from "./format";
import { TestCommand } from "./test";
import { TokenizeCommand } from "./tokenize";
import { UniversityCommand } from "./university";

commands.register(UniversityCommand);
commands.register(TokenizeCommand);
commands.register(TestCommand);
commands.register(FormatCommand);
commands.register(EditCommand);
commands.register(EchoCommand);
commands.register(DeleteCommand);
commands.register(CounterCommand);
commands.register(ConfirmationCommand);
commands.register(ButtonCommand);
commands.register(AvatarCommand);
