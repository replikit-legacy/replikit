import { Configuration } from "@replikit/core/typings";

import "@example/random";
import "@example/banking";
import "@example/darts";
import "@replikit/telegram";
import "@replikit/vk";
import "@replikit/discord";

const config: Configuration = {
    telegram: {
        token: process.env.TELEGRAM_TOKEN!
    },
    vk: {
        token: process.env.VK_TOKEN!,
        pollingGroup: +process.env.VK_GROUP!
    },
    storage: {
        connection: "mongodb://localhost:27017/replikit"
    },
    i18n: {
        defaultLocale: process.env.DEFAULT_LOCALE
    },
    cli: {
        tsconfig: "tsconfig.build.json"
    },
    help: {
        defaultLocale: process.env.DEFAULT_LOCALE!
    },
    sessions: {
        storage: "database"
    },
    discord: {
        token: process.env.DISCORD_TOKEN!
    }
};

export default config;
