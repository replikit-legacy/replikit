import "@replikit/router/typings";
import { LocaleConstructor } from "@replikit/i18n/typings";

declare module "@replikit/router/typings/context/context" {
    export interface Context {
        getLocale<T>(type: LocaleConstructor<T>): T;
    }
}
