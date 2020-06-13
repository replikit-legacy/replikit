import "@replikit/core/typings";
import { StorageConfiguration } from "@replikit/storage/typings";

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        storage: StorageConfiguration;
    }
}

declare module "@replikit/core/typings/hooks/hookMap" {
    export interface HookMap {
        "storage:database:init": void;
        "storage:database:done": void;
        "storage:database:ready": void;
    }
}
