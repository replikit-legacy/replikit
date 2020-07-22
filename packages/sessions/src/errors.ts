import { SessionType } from "@replikit/sessions";

export class StorageModuleNotFoundError extends Error {
    constructor(requirer: string) {
        super(`Module @replikit/storage was not found, but is required by ${requirer}`);
    }
}

export class InvalidSessionTypeError extends Error {
    constructor(type: SessionType) {
        super(`Unable to get a session of type ${SessionType[type]} from ChannelContext`);
    }
}
