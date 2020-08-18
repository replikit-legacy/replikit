import { updateConfig, hook, registerController } from "@replikit/core";
import { DiscordController } from "@replikit/discord";

updateConfig({ discord: { webhookName: "Replikit" } });

hook("core:startup:init", () => {
    registerController(new DiscordController());
});
