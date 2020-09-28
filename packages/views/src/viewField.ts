import { CompositionFactory, CompositionItem, CompositionValue } from "@replikit/core";
import { WidenLiterals } from "@replikit/core/typings";
import { View } from "@replikit/views";
import { InferPropType, PropField } from "@replikit/views/typings";

const viewComposer = new CompositionFactory<never, View>();

function createViewItem<T>(field: string, initial: T | undefined): CompositionValue<View, T> {
    return {
        init: ctx => {
            if (!ctx._data) {
                return;
            }
            ctx._data[field] ??=
                initial instanceof CompositionItem ? ctx._data[initial.field] : initial;
        },
        get: ctx => ctx._data[field] as T,
        set: (ctx, value) => (ctx._data[field] = value)
    };
}

export function state<T>(initial: T): InferPropType<T>;
export function state<T>(): InferPropType<T> | undefined;
export function state<T>(initial?: T): T {
    return viewComposer.compose((_, field) => createViewItem(field, initial));
}

export function prop<T>(initial: T): PropField<WidenLiterals<T>, false>;
export function prop<T>(): PropField<WidenLiterals<T>, true>;
export function prop<T>(initial?: T): PropField<WidenLiterals<T>> {
    return viewComposer.compose((_, field) =>
        createViewItem(field, initial as PropField<WidenLiterals<T>>)
    );
}
