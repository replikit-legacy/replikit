export class InvalidConstructorError extends Error {
    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor() {
        super(`An object cannot be constructed using base constructor. Use derived class instead.`);
    }
}
