import { ResolvedConfiguration } from "@replikit/core/typings";

export interface HookMap {
    "core:startup:init": void;
    "core:startup:done": void;
    "core:startup:ready": void;
    "core:shutdown:init": void;
    "core:shutdown:done": void;
    "core:settings:update": ResolvedConfiguration;
}
