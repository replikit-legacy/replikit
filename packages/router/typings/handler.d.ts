export type NextHandler = () => Promise<void> | void;

export type Handler<T> = (
    context: T,
    next: NextHandler
) => Promise<void> | void;
