import { SessionType } from "@replikit/sessions";

export class StorageModuleNotFoundError extends Error {
    constructor() {
        super("Module @replikit/storage was not found, but is required by MongoSessionStorage");
    }
}

export class InvalidSessionTypeError extends Error {
    constructor(type: SessionType) {
        super(`Unable to a get session of type ${SessionType[type]} from ChannelContext`);
    }
}
