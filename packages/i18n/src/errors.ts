import { config } from "@replikit/core";

export class MissingFallbackLocaleError extends Error {
    constructor(namespace?: string) {
        if (namespace) {
            super(`Fallback locale for namespace ${namespace} not found`);
            return;
        }
        super("Fallback locale not found");
    }
}

export class UnableToResolveLocaleError extends Error {
    constructor(target?: string) {
        if (!target) {
            super(`Unable to resolve default locale ${config.i18n.defaultLocale}`);
            return;
        }
        super(
            `Unable to resolve target locale ${target} or default locale ${config.i18n.defaultLocale}`
        );
    }
}
