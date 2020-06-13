import "@replikit/storage/typings";
import { HasPermissions } from "@replikit/permissions";

declare module "@replikit/storage/typings/entities/user" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends HasPermissions {}
}

declare module "@replikit/storage/typings/entities/member" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Member extends HasPermissions {}
}
