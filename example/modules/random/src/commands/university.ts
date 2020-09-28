import { UniversityView } from "@example/random";
import { Command } from "@replikit/commands";

export class UniversityCommand extends Command {
    name = "university";

    execute(): void {
        void this.enter(UniversityView);
    }
}
