import { createTestManager } from "@replikit/test-utils";
import { fromText, MessageBuilder } from "@replikit/messages";

describe("CommandStorage", () => {
    it.each([
        "/test abc 123",
        "/test abc",
        "/test abc abc",
        '/test "abc abc"',
        `/test "abc abc" 123`,
        `/test abc "123"`,
        "/test"
    ])(
        "should handle a command with required and optional parameters: %s",
        async text => {
            const { testManager, command } = createTestManager();
            command("test")
                .required("p1", String)
                .optional("p2", Number)
                .handler(context => {
                    expect({
                        p1: context.params.p1,
                        p2: context.params.p2
                    }).toMatchSnapshot();
                })
                .register();
            await testManager.processCommand(text);
            expect.assertions(1);
        }
    );

    it("should handle a command with alias", async () => {
        const { testManager, command } = createTestManager();
        command("test", "t")
            .handler(context => {
                expect(context.message.text).toBe("/t");
            })
            .register();
        await testManager.processCommand("/t");
        expect.assertions(1);
    });

    it.each(["/calc sum 20 22", "/calc diff 10 12", "/calc multiply"])(
        "should handle a command with subcommands: %s",
        async text => {
            const { testManager, command } = createTestManager();
            command("calc")
                .commands(
                    command("sum")
                        .required("p1", Number)
                        .required("p2", Number)
                        .handler(context => {
                            const result =
                                context.params.p1 + context.params.p2;
                            expect(result).toMatchSnapshot();
                        }),
                    command("diff")
                        .required("p1", Number)
                        .required("p2", Number)
                        .handler(context => {
                            const result =
                                context.params.p1 - context.params.p2;
                            expect(result).toMatchSnapshot();
                        })
                )
                .register();
            await testManager.processCommand(text);
            expect.assertions(1);
        }
    );

    it.each([
        ["a non-existing top-level command", "/test"],
        ["an undefined text", undefined],
        ["a non-command message", "hello"]
    ])("should ignore %s", async (_, text) => {
        const { testManager } = createTestManager();
        await testManager.processCommand(text!);
        expect.assertions(0);
    });

    it("should handle a command with a custom validator", async () => {
        const { testManager } = createTestManager();
        testManager
            .converter(Number)
            .validator((context, param, options) => {
                expect(param).toBe("123");
                expect(options.max).toBe(456);
                return +param + options.max!;
            })
            .register();
        testManager
            .command("test")
            .required("p1", Number, { max: 456 })
            .handler(context => {
                expect(context.params.p1).toBe(579);
            })
            .register();
        await testManager.processCommand("/test 123");
        expect.assertions(3);
    });

    it("should handle a command with a custom resolver", async () => {
        const { testManager } = createTestManager();
        testManager
            .converter(Number)
            .resolver((context, param, options) => {
                expect(param).toBe("123");
                expect(options.max).toBe(456);
                return Promise.resolve(+param + options.max!);
            })
            .register();
        testManager
            .command("test")
            .required("p1", Number, { max: 456 })
            .handler(context => {
                expect(context.params.p1).toBe(579);
            })
            .register();
        await testManager.processCommand("/test 123");
        expect.assertions(3);
    });

    it("should handle a command with a complete custom converter", async () => {
        const { testManager } = createTestManager();
        testManager
            .converter(Number)
            .validator((context, param) => [param + "0"])
            .resolver((context, param) => Promise.resolve(+param[0]))
            .register();
        testManager
            .command("test")
            .required("p1", Number)
            .handler(context => {
                expect(context.params.p1).toBe(20);
            })
            .register();
        await testManager.processCommand("/test 2");
        expect.assertions(1);
    });

    it.each(["validator", "resolver"] as const)(
        "should reply an error if %s returns a string",
        async method => {
            const { testManager } = createTestManager();
            testManager
                .converter(Number)
                // eslint-disable-next-line no-unexpected-multiline
                [method](() => "Invalid parameter")
                .register();
            testManager
                .command("test")
                .required("p1", Number)
                .handler(() => void 0)
                .register();
            await testManager.processCommand("/test 123");
            expect.assertions(1);
        }
    );

    it("should use a custom prefix", async () => {
        const { testManager } = createTestManager();
        testManager.commands.prefix = "!";
        testManager
            .command("test")
            .handler(context => expect(context.message.text).toBe("!test"))
            .register();
        await testManager.processCommand("!test");
        expect.assertions(1);
    });

    it("should handle an overloaded command", async () => {
        const { testManager, command } = createTestManager();
        command("test")
            .required("p1", String)
            .handler(context => {
                expect(context.message.text).toBe("/test one");
            })
            .register();
        command("test")
            .required("p1", String)
            .required("p2", String)
            .handler(context => {
                expect(context.message.text).toBe("/test one two");
            })
            .register();
        await testManager.processCommand("/test one");
        await testManager.processCommand("/test one two");
        expect.assertions(2);
    });

    it("should handle a nested overloaded command", async () => {
        const { testManager, command } = createTestManager();
        command("test")
            .commands(
                command("test")
                    .required("p1", String)
                    .handler(context => {
                        expect(context.message.text).toBe("/test test one");
                    }),
                command("test")
                    .required("p1", String)
                    .required("p2", String)
                    .handler(context => {
                        expect(context.message.text).toBe("/test test one two");
                    })
            )
            .register();
        await testManager.processCommand("/test test one");
        await testManager.processCommand("/test test one two");
        expect.assertions(2);
    });

    it.each([
        ["/test\ntest\ntest", "test\ntest"],
        ["/test test\ntest", "test\ntest"],
        ["/test test", "test"]
    ])(
        "should handle a command with text parameter: %s",
        async (text, result) => {
            const { testManager, command } = createTestManager();
            command("test")
                .text(false, true)
                .handler(context => {
                    expect(context.params.text).toBe(result);
                })
                .register();
            await testManager.processCommand(text);
            expect.assertions(1);
        }
    );

    it("should handle a command with text parameter with custom name", async () => {
        const { testManager, command } = createTestManager();
        command("test")
            .text("test")
            .handler(context => {
                expect(context.params.test).toBe("test\ntest");
            })
            .register();
        await testManager.processCommand("/test\ntest\ntest");
        expect.assertions(1);
    });

    it("should handle a command with text parameter splitted into lines", async () => {
        const { testManager, command } = createTestManager();
        command("test")
            .text(true)
            .handler(context => {
                const param = context.params.text;
                expect(param).toStrictEqual(["test", "test"]);
            })
            .register();
        await testManager.processCommand("/test\ntest\ntest");
        expect.assertions(1);
    });

    it("should handle a command with text parameter and skip validation", async () => {
        const { testManager, command } = createTestManager();
        command("test")
            .text(false, true)
            .handler(context => {
                expect(context.params.text).toBe("");
            })
            .register();
        await testManager.processCommand("/test");
        expect.assertions(1);
    });

    it("should handle a command with text parameter and reply an error", async () => {
        const { testManager, command } = createTestManager();
        command("test")
            .text()
            .handler(() => void 0)
            .register();
        await testManager.processCommand("/test");
        expect.assertions(1);
    });

    it("should handle a command with rest and text parameters", async () => {
        const { testManager, command } = createTestManager();
        command("test")
            .rest("strings", String)
            .text()
            .handler(context => {
                expect(context.params.strings).toMatchSnapshot();
                expect(context.params.text).toMatchSnapshot();
            })
            .register();
        await testManager.processCommand("/test abc 123\nfirst\nsecond");
        expect.assertions(2);
    });

    it.each(["/test 123", "/test 12 12", "/test", "/test abc"])(
        "should handle a command with rest parameters: %s",
        async text => {
            const { testManager, command } = createTestManager();
            command("test")
                .rest("numbers", Number)
                .handler(context => {
                    expect(context.params.numbers).toMatchSnapshot();
                })
                .register();
            await testManager.processCommand(text);
            expect.assertions(1);
        }
    );

    it("should handle a command with string rest parameters", async () => {
        const { testManager, command } = createTestManager();
        command("test")
            .rest("strings", String)
            .handler(context => {
                expect(context.params.strings).toMatchSnapshot();
            })
            .register();
        await testManager.processCommand("/test abc 123");
        expect.assertions(1);
    });

    it("should handle a command with rest parameters and resolver", async () => {
        const { testManager, command, converter } = createTestManager();
        converter(Number)
            .resolver((context, param) => +param)
            .register();
        command("test")
            .rest("numbers", Number)
            .handler(context => {
                expect(context.params.numbers).toMatchSnapshot();
            })
            .register();
        await testManager.processCommand("/test 123 456");
        expect.assertions(1);
    });

    it("should handle a command with rest parameters and resolver and reply an error", async () => {
        const { testManager, command, converter } = createTestManager();
        converter(Number)
            .resolver(() => "Invalid parameter")
            .register();
        command("test")
            .rest("numbers", Number)
            .handler(context => {
                expect(context.params.numbers).toMatchSnapshot();
            })
            .register();
        await testManager.processCommand("/test 123 456");
        expect.assertions(1);
    });

    it.each(["/test", "/test 123", "/test abc", "/test abc abc"])(
        "should handle a command with subcommands and default handler: %s",
        async text => {
            const { testManager, command } = createTestManager();
            command("test")
                .default("abc")
                .commands(
                    command("abc")
                        .required("p1", String)
                        .handler(context => {
                            expect(context.params.p1).toMatchSnapshot();
                        })
                )
                .register();
            await testManager.processCommand(text);
            expect.assertions(1);
        }
    );

    it("should handle a command returning OutMessage", async () => {
        const { testManager, command } = createTestManager();
        command("test")
            .handler(() => fromText("Hello"))
            .register();
        await testManager.processCommand("/test");
        expect.assertions(1);
    });

    it("should handle a command returning MessageBuilder", async () => {
        const { testManager, command } = createTestManager();
        command("test")
            .handler(() => new MessageBuilder().addText("Hello"))
            .register();
        await testManager.processCommand("/test");
        expect.assertions(1);
    });

    it("should handle a command with optional parameter with default value", async () => {
        const { testManager, command } = createTestManager();
        command("test")
            .optional("p1", Number, { default: 123 })
            .handler(context => {
                expect(context.params.p1).toBe(123);
            })
            .register();
        await testManager.processCommand("/test");
        expect.assertions(1);
    });

    it.each(["/test", "/test 1 2", "/test 1 2 3"])(
        "should handle a command with rest parameter count restriction: %s",
        async text => {
            const { testManager, command } = createTestManager();
            command("test")
                .rest("numbers", Number, { minCount: 1, maxCount: 2 })
                .handler(context => {
                    expect(context.params.numbers).toMatchSnapshot();
                })
                .register();
            await testManager.processCommand(text);
            expect.assertions(1);
        }
    );
});
