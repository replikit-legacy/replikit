import {
    DescriptionStorage,
    InvalidCommandDescriptionError,
    DefaultLocaleNotFoundError
} from "@replikit/help";
import { CommandStorage } from "@replikit/commands";
import { command } from "@replikit/commands";

describe("DescriptionStorage", () => {
    it("should add a locale with description messages", () => {
        const descriptionStorage = new DescriptionStorage();
        descriptionStorage.add("en", { help: "Show help" });
        descriptionStorage.add("en", { test: "Test" });

        expect(descriptionStorage).toMatchSnapshot();
    });

    it("should render a help message with multiple commands", () => {
        const descriptionStorage = new DescriptionStorage();
        descriptionStorage.add("en", {
            test: "Test",
            calc: { sum: "Sum two numbers", diff: "Diff two numbers" }
        });

        const commands = new CommandStorage();
        commands.register(
            command("test")
                .handler(() => void 0)
                .build()
        );
        commands.register(
            command("calc")
                .commands(
                    command("sum")
                        .required("a", Number)
                        .required("b", Number)
                        .handler(() => void 0),
                    command("diff")
                        .required("a", Number)
                        .required("b", Number)
                        .handler(() => void 0)
                )
                .build()
        );

        const message = descriptionStorage.render(commands.getCommands(), "en");
        expect(message).toMatchSnapshot();
    });

    it("should render a help message with overloaded command", () => {
        const descriptionStorage = new DescriptionStorage();
        descriptionStorage.add("en", { test: "Test" });

        const commands = new CommandStorage();
        commands.register(
            command("test")
                .handler(() => void 0)
                .build()
        );
        commands.register(
            command("test")
                .required("test", Number)
                .handler(() => void 0)
                .build()
        );

        const message = descriptionStorage.render(commands.getCommands(), "en");
        expect(message).toMatchSnapshot();
    });

    it("should throw an error when render an invalid structure 1", () => {
        const descriptionStorage = new DescriptionStorage();
        descriptionStorage.add("en", {
            test: {}
        });

        const commands = new CommandStorage();
        commands.register(
            command("test")
                .handler(() => void 0)
                .build()
        );

        const action = () =>
            descriptionStorage.render(commands.getCommands(), "en");
        expect(action).toThrow(InvalidCommandDescriptionError);
    });

    it("should throw an error when render an invalid structure 2", () => {
        const descriptionStorage = new DescriptionStorage();
        descriptionStorage.add("en", {
            calc: "Calc"
        });

        const commands = new CommandStorage();
        commands.register(
            command("calc")
                .commands(
                    command("sum")
                        .required("a", Number)
                        .required("b", Number)
                        .handler(() => void 0),
                    command("diff")
                        .required("a", Number)
                        .required("b", Number)
                        .handler(() => void 0)
                )
                .build()
        );

        const action = () =>
            descriptionStorage.render(commands.getCommands(), "en");
        expect(action).toThrow(InvalidCommandDescriptionError);
    });

    it("should throw an error when default locale not exists", () => {
        const descriptionStorage = new DescriptionStorage();
        const action = () => descriptionStorage.render([], "en");
        expect(action).toThrow(DefaultLocaleNotFoundError);
    });
});
