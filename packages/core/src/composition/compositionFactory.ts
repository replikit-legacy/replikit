import { compose, CompositionInitializer } from "@replikit/core";

export class CompositionFactory<C, RC> {
    compose<V>(initializer: CompositionInitializer<C, RC, V>): V {
        return compose(initializer);
    }
}
