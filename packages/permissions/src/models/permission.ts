import {
    EnumInstance,
    EntityType,
    InvalidConstructorError,
    permissionStorage,
    PermissionStorage
} from "@replikit/permissions";
import { Constructor } from "@replikit/core/typings";

export class PermissionInstance<T extends EntityType = EntityType> extends EnumInstance {
    /** @internal */
    static entityType: EntityType;

    /** @internal */
    static _permissionStorage?: PermissionStorage;

    private static get permissionStorage(): PermissionStorage {
        return PermissionInstance._permissionStorage ?? permissionStorage;
    }

    _permissionBrand: void;

    type: T;

    constructor() {
        super();
        if (new.target === PermissionInstance) {
            throw new InvalidConstructorError();
        }
        this.type = PermissionInstance.entityType as T;
        PermissionInstance.permissionStorage._permissions.push(this);
    }
}

export function Permission<T extends EntityType>(type: T): Constructor<PermissionInstance<T>> {
    PermissionInstance.entityType = type;
    return PermissionInstance;
}
