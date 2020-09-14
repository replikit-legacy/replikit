import { MessageEventPayload } from "@replikit/core/typings";

export interface ButtonEventPayload extends MessageEventPayload {
    buttonPayload: string | string;
}
