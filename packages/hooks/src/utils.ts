/* eslint-disable @typescript-eslint/ban-types */

import { CommandBuilder } from "@replikit/commands";

interface BuildableHook extends Function {
    build: (builder: CommandBuilder, args: unknown[]) => CommandBuilder;
}

function isBuildableHook(hook: Function): hook is BuildableHook {
    return "build" in hook;
}

export function applyHook(
    builder: CommandBuilder,
    hook: Function,
    args: unknown[]
): CommandBuilder {
    return isBuildableHook(hook) ? hook.build(builder, args) : builder;
}
