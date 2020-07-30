import { InMessage, MemberEventPayload } from "@replikit/core/typings";

export interface MessageEventPayload extends MemberEventPayload {
    message: InMessage;
}
