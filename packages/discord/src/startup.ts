import { updateConfig, hook, registerController } from "@replikit/core";
import { DiscordController } from "@replikit/discord";

updateConfig({ discord: { disableWebhooks: false } });

hook("core:startup:init", () => {
    registerController(new DiscordController());
});
