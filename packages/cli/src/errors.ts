export class InvalidTSConfigurationError extends Error {
    constructor(message: string) {
        super(`Invalid tsconfig: ${message}`);
    }
}

export class MissingTSConfigurationField extends InvalidTSConfigurationError {
    constructor(field: string) {
        super(`Missing field ${field}`);
    }
}
