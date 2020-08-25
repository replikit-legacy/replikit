import { Constructor } from "@replikit/core/typings";

export class RepositoryNotRegisteredError extends Error {
    constructor(constructor: Constructor) {
        super(`Repository for type ${constructor.name} not found`);
    }
}

export class RepositoryExtensionNotRegisteredError extends Error {
    constructor(constructor: Constructor) {
        super(`Repository extension for type ${constructor.name} not found`);
    }
}

export class UnlinkedEntityError extends Error {
    constructor(method: string) {
        super(`Cannot perform ${method} method on unlinked entity`);
    }
}

export class ChannelNotFoundError extends Error {
    constructor() {
        super("Unable to find the channel");
    }
}

export class UserNotFoundError extends Error {
    constructor() {
        super("Unable to find the user");
    }
}

export class MemberNotFoundError extends Error {
    constructor() {
        super("Unable to find the member");
    }
}

export class NextIdDetectionError extends Error {
    constructor(collection: string) {
        super(`Unable to detect next id of collection ${collection}`);
    }
}
