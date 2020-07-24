import "@replikit/router/typings";
import { LocaleConstructor } from "@replikit/i18n/typings";

declare module "@replikit/router/typings/context/channelContext" {
    export interface ChannelContext {
        getLocale<T>(type: LocaleConstructor<T>): T;
    }
}
