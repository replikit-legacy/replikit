import { ButtonSwitchInline } from "@replikit/core/typings";

export interface Button {
    text: string;
    url?: string;
    payload?: string;
    switchInline?: ButtonSwitchInline;
}
