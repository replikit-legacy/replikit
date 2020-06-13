import "@replikit/storage/typings";
import { DartsUserExtension } from "@example/darts/typings";

declare module "@replikit/storage/typings/entities/user" {
    export interface User {
        darts: DartsUserExtension;
    }
}
