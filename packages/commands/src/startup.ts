import { hook, config } from "@replikit/core";
import { commands } from "@replikit/commands";
import { router } from "@replikit/router";

hook("core:settings:update", () => {
    if (config.commands?.prefix) {
        commands.prefix = config.commands.prefix;
    }
});

hook("core:startup:init", () => {
    router.of("message:received").use(commands.process.bind(commands));
});
