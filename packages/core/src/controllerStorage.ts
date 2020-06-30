import { Controller, invokeHook, logger, hasHandler, config } from "@replikit/core";

const controllers: Controller[] = [];

export function registerController(controller: Controller): void {
    const existing = controllers.find(x => x.name === controller.name);
    if (existing) {
        throw new Error(`Controller '${controller.name}' already registered`);
    }

    controllers.push(controller);
}

export function resolveController(name: string): Controller {
    const controller = controllers.find(x => x.name === name);
    if (!controller) {
        throw new Error(`Controller '${name}' not found`);
    }
    return controller;
}

export async function bootstrap(): Promise<void> {
    try {
        logger.info("Booting up replikit core ...");
        await invokeHook("core:startup:init");
        if (!hasHandler()) {
            logger.warn("Event handler was not specified");
        }
        await invokeHook("core:startup:done");
        for (const controller of controllers) {
            if (config.core.disabledControllers?.includes(controller.name)) {
                logger.info(`Skipping ${controller.name} controller`);
                continue;
            }
            logger.info(`Starting ${controller.name} controller`);
            await controller.start();
        }
        await invokeHook("core:startup:ready");
        logger.info("Replikit Core is ready");
    } catch (e) {
        logger.fatal("Unexpected error occurred while booting the core", e);
    }
}
