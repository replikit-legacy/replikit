import { RecursiveRequired, CoreConfiguration } from "@replikit/core/typings";

export interface Configuration {
    core?: CoreConfiguration;
}

export type ResolvedConfiguration = RecursiveRequired<Configuration>;
