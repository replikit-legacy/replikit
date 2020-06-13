import "@replikit/i18n/typings";
import { StorageLocale } from "@replikit/storage/typings";

declare module "@replikit/i18n/typings/locale" {
    export interface Locale {
        storage: StorageLocale;
    }
}
