import { Configuration } from "@replikit/core/typings";
// import { MongoSessionStorage } from "@replikit/sessions";

import "@example/random";
import "@example/banking";
import "@example/darts";
import "@replikit/telegram";
import "@replikit/vk";

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
        storage: new Map()
        // storage: new MongoSessionStorage()
    }
};

export default config;
