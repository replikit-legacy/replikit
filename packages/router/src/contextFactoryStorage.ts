import { EventName, Event } from "@replikit/core/typings";
import { ContextMap } from "@replikit/router/typings";
import { invokeHook } from "@replikit/core";

type ContextFactory<T extends EventName = EventName> = (event: Event<T>) => ContextMap[T];

export class ContextFactoryStorage {
    private readonly factoryMap = new Map<EventName, ContextFactory>();

    /**
     * Registers an event context factory.
     */
    register<T extends EventName>(type: T, handler: ContextFactory<T>): void {
        this.factoryMap.set(type, (handler as unknown) as ContextFactory);
    }

    /**
     * Creates a new context resolved from specified event using appropriate event factory.
     * Throws an error if the factory was not found.
     */
    async createContext<T extends EventName>(event: Event<T>): Promise<ContextMap[T]> {
        const factory = this.factoryMap.get(event.type);
        if (!factory) {
            throw new Error(`Context factory for event ${event.type} not found`);
        }
        const context = factory(event) as ContextMap[T];
        await invokeHook("router:context:created", context);
        return context;
    }
}

export const contextFactories = new ContextFactoryStorage();
