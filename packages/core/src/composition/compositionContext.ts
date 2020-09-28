import { CompositionItem } from "@replikit/core";
import { HasFields, SafeFunction } from "@replikit/core/typings";

export interface Composition extends HasFields {
    __init__?: SafeFunction;
}

export class CompositionContext {
    constructor(private context: unknown) {}

    createComposition(obj: HasFields): [Composition, HasFields] {
        const result = {} as Composition;
        const fields = {} as HasFields;
        const initHooks: SafeFunction[] = [];
        for (const key in obj) {
            const value = obj[key];
            if (!value) {
                continue;
            }

            if (value instanceof CompositionItem) {
                value.field = key;
                const compositionValue = value.initialize(this.context, key);
                if (compositionValue.init) {
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    initHooks.push(compositionValue.init);
                }
                Object.defineProperty(result, key, {
                    get() {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return compositionValue.get(this.context ?? this);
                    },
                    set:
                        compositionValue.set &&
                        function (this: HasFields, value) {
                            compositionValue.set!(this.context ?? this, value);
                        }
                });
                continue;
            }

            if (typeof value === "object") {
                [result[key]] = this.createComposition(value as HasFields);
            }

            fields[key] = value;
        }
        if (initHooks.length) {
            result.__init__ = function () {
                const context = this.context ?? this;
                for (const hook of initHooks) hook(context);
            };
        }
        return [result, fields];
    }
}
