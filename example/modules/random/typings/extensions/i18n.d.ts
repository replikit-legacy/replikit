import "@replikit/i18n/typings";
import { RandomLocale } from "@example/random/typings";

declare module "@replikit/i18n/typings/locale" {
    export interface Locale {
        random: RandomLocale;
    }
}
