import { WidenLiterals } from "@replikit/core/typings";
import { InferPropType, PropField } from "@replikit/views/typings";

export class ViewField {
    name: string;

    constructor(public initial?: unknown) {}
}

export function state<T>(initial: T): InferPropType<T>;
export function state<T>(): InferPropType<T> | undefined;
export function state<T>(initial?: T): T {
    return (new ViewField(initial) as unknown) as T;
}

export function prop<T>(initial: T): PropField<WidenLiterals<T>, false>;
export function prop<T>(): PropField<WidenLiterals<T>, true>;
export function prop<T>(initial?: T): PropField<WidenLiterals<T>> {
    return (new ViewField(initial) as unknown) as PropField<WidenLiterals<T>>;
}
