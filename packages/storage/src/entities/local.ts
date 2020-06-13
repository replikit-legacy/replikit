import { Local as _Local } from "@replikit/storage/typings/";
import { resolveController, Controller } from "@replikit/core";
import { Entity } from "@replikit/storage";

export class Local extends Entity {
    getController(): Controller {
        return resolveController(this.controller);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Local extends _Local {}
