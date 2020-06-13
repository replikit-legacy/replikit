import {
    CommandParameter,
    CommandHandler,
    MultilineCommandParameter,
    RestCommandParameter
} from "@replikit/commands/typings";
import { MiddlewareRouter } from "@replikit/commands";

export interface Command {
    name: string;
    commands: Command[];
    params: CommandParameter[];
    requiredCount: number;
    aliases: string[];
    middlewareRouter?: MiddlewareRouter;
    rest?: RestCommandParameter;
    handler?: CommandHandler;
    multiline?: MultilineCommandParameter;
    default?: string;
    usage?: string;
    parent?: Command;
}
