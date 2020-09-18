import { SessionManager } from "@replikit/sessions";
import { Exclude } from "class-transformer";

export class Session {
    @Exclude()
    private key: string;

    @Exclude()
    private sessionManager: SessionManager;

    reset(): Promise<void> {
        return this.sessionManager.delete(this.key);
    }

    save(): Promise<void> {
        return this.sessionManager.saveSession(this.key);
    }
}
