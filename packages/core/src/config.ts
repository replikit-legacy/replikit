import { Configuration, RecursivePartial, ResolvedConfiguration } from "@replikit/core/typings";
import { deepmerge, invokeHook } from "@replikit/core";

export const config: ResolvedConfiguration = {} as ResolvedConfiguration;

export function updateConfig(update: RecursivePartial<Configuration>): void {
    const previous = deepmerge({} as ResolvedConfiguration, config);
    deepmerge(config, update);
    void invokeHook("core:settings:update", previous);
}

updateConfig({ core: { cache: { expire: 10000 }, logLevel: "info" } });
