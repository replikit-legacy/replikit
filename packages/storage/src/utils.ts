import { Constructor } from "@replikit/core/typings";

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
