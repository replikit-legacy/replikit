import { Entity, Account } from "@replikit/storage/typings";

export interface User extends Entity {
    username: string;
    accounts: Account[];
}
