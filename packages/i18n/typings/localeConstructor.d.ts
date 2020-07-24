import { Constructor } from "@replikit/core/typings";

export interface LocaleConstructor<T = unknown> extends Constructor<T> {
    readonly namespace: string;
}
