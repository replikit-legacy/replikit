import { command } from "@replikit/commands";
import { balance } from "./balance";
import { transfer } from "./transfer";

command("money", "банк")
    .default("balance")
    .commands(balance, transfer)
    .register();
