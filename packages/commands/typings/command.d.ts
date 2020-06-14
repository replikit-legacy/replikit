import {
    CommandParameter,
    CommandHandler,
    TextCommandParameter,
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
    text?: TextCommandParameter;
    default?: string;
    usage?: string;
    parent?: Command;
}
