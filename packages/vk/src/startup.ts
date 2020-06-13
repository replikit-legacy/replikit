import { hook, registerController } from "@replikit/core";
import { VKController } from "@replikit/vk";

hook("core:startup:init", () => {
    registerController(new VKController());
});
