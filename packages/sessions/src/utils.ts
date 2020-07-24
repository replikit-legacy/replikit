import { SessionConstructor } from "@replikit/sessions/typings";

export function createSessionKey(type: SessionConstructor, controllerName: string): string {
    return `${type.type}_${type.namespace}_${controllerName}`;
}
