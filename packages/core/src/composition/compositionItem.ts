export interface CompositionValue<RC, V> {
    init?(context: RC): void;
    get(context: RC): V;
    set?(context: RC, value: V): void;
}

export type CompositionInitializer<C, RC, V> = (
    context: C,
    field: string
) => CompositionValue<RC, V>;

export class CompositionItem<C = unknown, RC = unknown, V = unknown> {
    constructor(private initializer: CompositionInitializer<C, RC, V>) {}

    field: string;

    initialize(context: C, field: string): CompositionValue<RC, V> {
        return this.initializer(context, field);
    }
}

export function compose<C, RC, V>(initializer: CompositionInitializer<C, RC, V>): V {
    return (new CompositionItem(initializer) as unknown) as V;
}
