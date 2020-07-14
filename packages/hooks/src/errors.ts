export class ContextUnaccessibleError extends Error {
    constructor() {
        super("Context is unaccessible in the current scope");
    }
}
