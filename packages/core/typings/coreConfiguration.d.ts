import { LogLevelName } from "@replikit/core/typings";

export interface CoreCacheConfiguration {
    expire?: number;
}

export interface CoreConfiguration {
    logLevel?: LogLevelName;
    disabledControllers?: string[];
    cache?: CoreCacheConfiguration;
}
