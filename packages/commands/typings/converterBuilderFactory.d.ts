import { Constructor } from "@replikit/core/typings";
import { ConverterBuilder } from "@replikit/commands";

export type ConverterBuilderFactory = <T>(type: Constructor<T>) => ConverterBuilder<T>;
