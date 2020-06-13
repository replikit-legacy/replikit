import "@replikit/i18n/typings";
import { CommandsLocale } from "@replikit/commands/typings";

declare module "@replikit/i18n/typings/locale" {
    export interface Locale {
        commands: CommandsLocale;
    }
}
