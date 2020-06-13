import "@replikit/storage/typings";
import { BankingUserExtension } from "@example/banking/typings";

declare module "@replikit/storage/typings/entities/user" {
    export interface User {
        banking: BankingUserExtension;
    }
}
