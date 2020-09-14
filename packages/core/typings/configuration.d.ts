import { RecursiveRequired, CoreConfiguration } from "@replikit/core/typings";

export interface Configuration {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    core?: CoreConfiguration;
}

export type ResolvedConfiguration = RecursiveRequired<Configuration>;
