export class InvalidTSConfigurationError extends Error {
    constructor(message: string) {
        super(`Invalid tsconfig: ${message}`);
    }
}

export class ModulePathMappingNotFound extends InvalidTSConfigurationError {
    constructor() {
        super("Unable to find a valid module path mapping");
    }
}

export class MissingTSConfigurationField extends InvalidTSConfigurationError {
    constructor(field: string) {
        super(`Missing field ${field}`);
    }
}
