import { Event, EventName } from "@replikit/core/typings";
import { HandlerChain, ContextFactoryStorage, contextFactories } from "@replikit/router";
import { ContextMap } from "@replikit/router/typings";

type RouterChain = HandlerChain<ContextMap[keyof ContextMap]>;

export class Router {
    private readonly chainMap = new Map<EventName, RouterChain>();
    private finalChain?: RouterChain;

    constructor(private readonly contextFactories: ContextFactoryStorage) {}

    get final(): RouterChain {
        if (!this.finalChain) {
            this.finalChain = new HandlerChain();
        }
        return this.finalChain;
    }

    of<T extends EventName>(type: T): HandlerChain<ContextMap[T]> {
        let chain = this.chainMap.get(type);
        if (!chain) {
            chain = new HandlerChain();
            this.chainMap.set(type, chain);
        }
        return (chain as unknown) as HandlerChain<ContextMap[T]>;
    }

    async process(event: Event): Promise<void> {
        const chain = this.chainMap.get(event.type);
        if (!chain && !this.finalChain) {
            return;
        }
        const context = await this.contextFactories.createContext(event);
        await chain?.process(context);
        await this.finalChain?.process(context);
    }
}

export const router = new Router(contextFactories);
