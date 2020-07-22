import hookTransformer, { FunctionNotModifiedError } from "@replikit/hooks/plugin";
import { code, createTranspiler } from "@replikit/test-utils";

const transpileModule = createTranspiler({ before: [hookTransformer] });

describe("hook transformer", () => {
    it("should collect hook calls from function body and add corresponding applyHook calls to CommandBuilder", () => {
        const input = code`
            command("test")
                .handler(handler)
                .register();

            function handler() {
                const p1 = useRequired("p1", String);
                const p2 = useOptional("p2", Number, { default: 123 });
            }
        `;
        const result = transpileModule(input);
        expect(result).toMatchSnapshot();
    });

    it("should do not require @replikit/hooks if it already required", () => {
        const input = code`
            import { useRequired } from "@replikit/hooks";

            command("test")
                .handler(handler)
                .register();

            function handler() {
                const p1 = useRequired("p1", String);
            }
        `;
        const result = transpileModule(input);
        expect(result).toMatchSnapshot();
    });

    it("should throw an error when declaring a handler before CommandBuilder call", () => {
        const input = code`
            function handler() {
                const p1 = useRequired("p1", String);
            }

            command("test")
                .handler(handler)
                .register();
        `;
        const action = () => transpileModule(input);
        expect(action).toThrow(FunctionNotModifiedError);
    });

    it("should ignore arrow function as handlers", () => {
        const input = code`
            command("test")
                .handler(() => {})
                .register();
        `;
        const result = transpileModule(input);
        expect(result).toMatchSnapshot();
    });

    it("should ignore commands without handler", () => {
        const input = code`
            command("test")
                .commands()
                .register();
        `;
        const result = transpileModule(input);
        expect(result).toMatchSnapshot();
    });
});
