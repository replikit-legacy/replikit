import "@replikit/core/typings";
import { I18NConfiguration } from "@replikit/i18n/typings";

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        i18n?: I18NConfiguration;
    }
}
