import { Local as _Local } from "@replikit/storage/typings/";
import { Controller, tryResolveController } from "@replikit/core";
import { Entity } from "@replikit/storage";

export class Local extends Entity {
    getController(): Controller | undefined {
        return tryResolveController(this.controller);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Local extends _Local {}
