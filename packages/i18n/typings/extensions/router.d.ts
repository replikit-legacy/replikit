import "@replikit/router/typings";
import { Locale } from "@replikit/i18n/typings";

declare module "@replikit/router/typings/context/channelContext" {
    export interface ChannelContext {
        t: Locale;
    }
}
