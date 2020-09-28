import { Composition, CompositionContext } from "@replikit/core";
import { Constructor, HasFields } from "@replikit/core/typings";

export interface CompositionInfo<T = unknown> {
    fields: T;
    // eslint-disable-next-line @typescript-eslint/ban-types
    prototype: object;
}

export function createCompositionInfo<T extends Constructor>(
    constructor: T,
    context: unknown
): CompositionInfo<InstanceType<T>> {
    const instance = new constructor();
    const compositionContext = new CompositionContext(context);
    const [composition, fields] = compositionContext.createComposition(instance as HasFields);
    const prototype = Object.create(
        constructor.prototype,
        Object.getOwnPropertyDescriptors(composition)
    );
    return { prototype, fields: fields as InstanceType<T> };
}

function setContext(prototype: Composition, hasFields: Composition, context: unknown): void {
    for (const key in prototype) {
        const value = prototype[key];
        if (value && typeof value === "object") {
            hasFields[key] = Object.create(value);
            setContext(prototype[key] as HasFields, hasFields[key] as HasFields, context);
            (hasFields[key] as HasFields).context = context;
        }
    }
    if (prototype.__init__) {
        prototype.__init__.apply(context);
    }
}

export function createCompositionInstance<T>(info: CompositionInfo, context: unknown): T {
    const instance = Object.create(info.prototype);
    Object.assign(instance, info.fields);
    Object.assign(instance, context);
    setContext(info.prototype as HasFields, instance, instance);
    return instance as T;
}
