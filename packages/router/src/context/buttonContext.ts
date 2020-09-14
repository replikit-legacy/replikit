import { MessageContext } from "@replikit/router";
import { ButtonContext as _ButtonContext } from "@replikit/router/typings";
import { ButtonEvent } from "@replikit/core/typings";

export class ButtonContext<T extends ButtonEvent = ButtonEvent> extends MessageContext<T> {
    get buttonPayload(): string | undefined {
        return this.payload.buttonPayload;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ButtonContext extends _ButtonContext {}
