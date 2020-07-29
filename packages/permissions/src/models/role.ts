import {
    EntityType,
    EnumInstance,
    PermissionInstance,
    InvalidConstructorError,
    PermissionStorage,
    permissionStorage
} from "@replikit/permissions";

interface RoleOptions {
    permissions?: PermissionInstance[];
    fallbackRoles?: RoleInstance[];
}

export class RoleInstance<T extends EntityType = EntityType> extends EnumInstance {
    /** @internal */
    static entityType: EntityType;

    /** @internal */
    static _permissionStorage?: PermissionStorage;

    private static get permissionStorage(): PermissionStorage {
        return RoleInstance._permissionStorage ?? permissionStorage;
    }

    _roleBrand: void;

    type: T;
    permissions: PermissionInstance[];
    fallbackRoles: RoleInstance[];

    constructor(options?: RoleOptions) {
        super();
        if (new.target === RoleInstance) {
            throw new InvalidConstructorError();
        }
        this.type = RoleInstance.entityType as T;
        RoleInstance.permissionStorage._roles.push(this);
        if (!options) {
            this.permissions = [];
            this.fallbackRoles = [];
            return;
        }
        this.permissions = options.permissions ?? [];
        this.fallbackRoles = options.fallbackRoles ?? [];
    }
}

export interface RoleConstructor<T extends EntityType> {
    new (options?: RoleOptions): RoleInstance<T>;
}

export function Role<T extends EntityType>(type: T): RoleConstructor<T> {
    RoleInstance.entityType = type;
    return RoleInstance;
}
