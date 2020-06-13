import "@replikit/i18n/typings";
import { AuthorizationLocale } from "@replikit/authorization/typings";

declare module "@replikit/i18n/typings/locale" {
    export interface Locale {
        authorization: AuthorizationLocale;
    }
}
