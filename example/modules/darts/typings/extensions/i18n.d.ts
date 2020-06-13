import "@replikit/i18n/typings";
import { DartsLocale } from "@example/darts/typings";

declare module "@replikit/i18n/typings/locale" {
    export interface Locale {
        darts: DartsLocale;
    }
}
