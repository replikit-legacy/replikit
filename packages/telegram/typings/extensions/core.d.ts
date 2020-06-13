import "@replikit/core/typings";
import { TelegramConfiguration } from "@replikit/telegram/typings";
import { MessageEntity } from "telegraf/typings/telegram-types";

export interface Dice {
    value: number;
    emoji: string;
}

declare module "@replikit/core/typings/configuration" {
    export interface Configuration {
        telegram: TelegramConfiguration;
    }
}

declare module "@replikit/core/typings/models/inMessage" {
    export interface InMessage {
        telegram?: {
            entities?: MessageEntity[];
            dice?: Dice;
        };
    }
}
