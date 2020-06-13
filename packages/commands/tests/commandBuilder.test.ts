import { MiddlewareStage } from "@replikit/commands";
import { createTestManager } from "@replikit/test-utils";

describe("CommandBuilder", () => {
    it("should build a complex command", () => {
        const { command } = createTestManager();
        const result = command("test", "t")
            .required("p1", String)
            .optional("p2", Number)
            .optional("p3", Boolean, { default: true })
            .rest("p4", Number)
            .multiline("p5", true, true)
            .use(MiddlewareStage.AfterResolution, context => void context)
            .use({
                stage: MiddlewareStage.BeforeResolution,
                handler: context => void context
            })
            .commands(command("subcommand"))
            .build();
        expect(result).toMatchSnapshot();
    });

    it("should register a constructed command in a CommandStorage", () => {
        const { testManager, command } = createTestManager();
        command("test").register();
        expect(testManager.commands).toMatchSnapshot();
    });
});
