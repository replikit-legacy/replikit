import { CommandContext, Middleware } from "@replikit/commands/typings";
import { HandlerChain } from "@replikit/router";
import { MiddlewareStage } from "@replikit/commands";

export class MiddlewareRouter {
    private readonly chainMap = new Map<
        MiddlewareStage,
        HandlerChain<CommandContext>
    >();

    add(middleware: Middleware): void {
        let chain = this.chainMap.get(middleware.stage);
        if (!chain) {
            chain = new HandlerChain();
            this.chainMap.set(middleware.stage, chain);
        }
        chain.use(middleware.handler);
    }

    process(
        stage: MiddlewareStage,
        context: CommandContext
    ): void | Promise<void> {
        const chain = this.chainMap.get(stage);
        if (!chain) {
            context.skipped = true;
            return;
        }
        context.skipped = false;
        return chain.process(context);
    }
}
