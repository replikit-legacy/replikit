export class FunctionNotModifiedError extends Error {
    constructor(name: string) {
        const messages = [
            `Function named ${name} that specified as command handler was not modified.`,
            "You should declare this function after command(...) call."
        ];
        super(messages.join("\n"));
    }
}
