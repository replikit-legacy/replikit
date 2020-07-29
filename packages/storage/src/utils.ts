import { Constructor } from "@replikit/core/typings";
import { Entity, FallbackStrategy } from "@replikit/storage";
import { EntityExtensionConstructor, ApplyExtensions } from "@replikit/storage/typings";

export const CacheResult: MethodDecorator = <T>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    instance: Object,
    name: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> => {
    const original = (descriptor.value! as unknown) as Constructor;
    const key = `__result_${name.toString()}`;
    return {
        value: (function(this: unknown, ...args: unknown[]): unknown {
            let result = (this as Record<string, unknown>)[key];
            if (!result) {
                result = original.apply(this, args);
                (this as Record<string, unknown>)[key] = result;
            }
            return result;
        } as unknown) as T
    };
};

export function loadExtensions<T extends Entity, E extends EntityExtensionConstructor[]>(
    type: T,
    ...extensions: E
): asserts type is ApplyExtensions<T, E> {
    for (const extension of extensions) {
        type.loadExtension(extension);
    }
}

/** @internal */
export function extractArguments(
    args: unknown[],
    defaultStrategy: FallbackStrategy
): [FallbackStrategy, EntityExtensionConstructor[]] {
    let fallbackStrategy: FallbackStrategy;
    let extensions: EntityExtensionConstructor[];
    if (typeof args[0] === "number") {
        fallbackStrategy = args[0];
        extensions = args.slice(1) as EntityExtensionConstructor[];
    } else {
        fallbackStrategy = defaultStrategy;
        extensions = args as EntityExtensionConstructor[];
    }
    return [fallbackStrategy, extensions];
}
