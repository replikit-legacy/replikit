import "@replikit/core/typings";
import { StorageConfiguration } from "@replikit/storage/typings";
import { AccountContext } from "@replikit/router";
import { User } from "@replikit/storage";

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        storage: StorageConfiguration;
    }
}

interface UserConflictPayload {
    context: AccountContext;
    user: User;
}

declare module "@replikit/core/typings/hooks/hookMap" {
    export interface HookMap {
        "storage:database:init": void;
        "storage:database:done": void;
        "storage:database:ready": void;
        "storage:user:conflict": UserConflictPayload;
    }
}
