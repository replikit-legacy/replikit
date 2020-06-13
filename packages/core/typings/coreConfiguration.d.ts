import { LogLevelName, ControllerConfiguration } from "@replikit/core/typings";

export interface CoreConfiguration {
    logLevel?: LogLevelName;
    controller?: ControllerConfiguration;
    disabledControllers?: string[];
    cache?: {
        expire?: number;
    };
}
