import { command } from "@replikit/commands";
import { sum } from "./sum";
import { mul } from "./mul";

command("calc")
    .commands(sum, mul)
    .register();
