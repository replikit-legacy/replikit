export class InvalidCommandDescriptionError extends Error {
    constructor() {
        super("Description structure does not match the command structure");
    }
}

export class DefaultLocaleNotFoundError extends Error {
    constructor(locale: string) {
        super(`Default locale ${locale} not found`);
    }
}
