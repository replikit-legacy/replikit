import hookTransformer from "@replikit/hooks/plugin";
import { code, transpileModule } from "@replikit/test-utils";

describe("hook transformer", () => {
    it("should collect parameters from function hooks and add to CommandBuilder", () => {
        const input = code`
            import { command } from "@replikit/commands";
            
            command("test")
                .handler(handler)
                .register();

            function handler() {
                const p1 = useRequired("p1", String);
                const p2 = useOptional("p2", Number, { default: 123 });
                const p3 = useText("p3");
                const p4 = useRest("p4", Number);
            }
        `;
        const result = transpileModule(input, { before: [hookTransformer] });
        expect(result).toMatchSnapshot();
    });
});
