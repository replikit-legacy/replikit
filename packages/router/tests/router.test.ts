import { Router, MessageContext, contextFactories } from "@replikit/router";
import { InMessage } from "@replikit/core/typings";

describe("router", () => {
    it("should ignore event without handlers", async () => {
        const router = new Router(contextFactories);

        await router.process({ type: "message:received", payload: undefined! });
    });

    it("should process event with multiple handlers", async () => {
        const router = new Router(contextFactories);

        router.of("message:received").use((context, next) => {
            expect(context.message.text).toBe("Test");
            context.message.text = "Test1";
            next();
        });

        router.of("message:received").use(context => {
            expect(context.message.text).toBe("Test1");
        });

        await router.process({
            type: "message:received",
            payload: {
                message: { text: "Test" } as InMessage
            } as MessageContext
        });

        expect.assertions(2);
    });

    it("should call handlers from final chain if it exists", async () => {
        const router = new Router(contextFactories);

        router.final.use(context => {
            expect(context).toBeDefined();
        });

        await router.process({ type: "message:received", payload: {} as MessageContext });

        expect.assertions(1);
    });
});
