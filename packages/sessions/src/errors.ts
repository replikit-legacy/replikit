import { SessionType } from "@replikit/sessions";
import { Context } from "@replikit/router";

export class InvalidSessionTypeError extends Error {
    constructor(type: SessionType, context: Context) {
        super(
            `Unable to get a session of type ${SessionType[type]} from ${context.constructor.name}`
        );
    }
}
