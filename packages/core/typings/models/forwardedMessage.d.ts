import { InMessage } from "@replikit/core/typings";

export interface ForwardedMessage extends InMessage {
    controllerName: string;
}
