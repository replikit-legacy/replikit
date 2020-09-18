import { SessionStorage } from "@replikit/sessions/typings";

export type SessionStorageOption = "memory" | "database" | SessionStorage;

export interface SessionsConfiguration {
    storage: SessionStorageOption;
}
