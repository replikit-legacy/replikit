import { InMessage, AccountEventPayload } from "@replikit/core/typings";

export interface MessageEventPayload extends AccountEventPayload {
    message: InMessage;
}
