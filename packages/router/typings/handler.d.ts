export type NextHandler = () => Promise<unknown> | unknown;

export type Handler<T> = (
    context: T,
    next: NextHandler
) => Promise<unknown> | unknown;
