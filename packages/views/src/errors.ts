export class ViewAlreadyRegisteredError extends Error {
    constructor(name: string) {
        super(`View with ${name} already registered`);
    }
}

export class ViewNotRegisteredError extends Error {
    constructor(name: string) {
        super(`View with ${name} not found`);
    }
}
