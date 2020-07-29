import { Constructor } from "@replikit/core/typings";

export interface EntityExtensionConstructor<T = unknown> extends Constructor<T> {
    key: string;
}
