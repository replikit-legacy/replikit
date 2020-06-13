import { CommandContext } from "@replikit/commands/typings";
import { Handler } from "@replikit/router/typings";
import { MiddlewareStage } from "@replikit/commands";

type MiddlewareHandler = Handler<CommandContext>;

export interface Middleware {
    stage: MiddlewareStage;
    handler: MiddlewareHandler;
}
