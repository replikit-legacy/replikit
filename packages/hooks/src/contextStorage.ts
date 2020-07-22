import { MessageContext } from "@replikit/router";

let _context: MessageContext;

/** @internal */
export function setContext(context: MessageContext): void {
    _context = context;
}

export function useContext(): MessageContext {
    return _context;
}
