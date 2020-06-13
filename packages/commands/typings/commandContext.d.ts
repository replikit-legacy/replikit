import { MessageContext } from "@replikit/router";

export interface Parameters {
    [key: string]: unknown;
}

export interface CommandContext<P = Parameters> extends MessageContext {
    params: P;
}
