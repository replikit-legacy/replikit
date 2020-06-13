export type Handler<T> = (context: T, next: Function) => Promise<void> | void;
