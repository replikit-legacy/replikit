import { EntityExtensionConstructor } from "@replikit/storage/typings";
import { Entity } from "@replikit/storage";

export type ApplyExtensions<T extends Entity, E extends EntityExtensionConstructor[]> = T &
    { [K in E[number]["key"]]: InstanceType<Extract<E[number], { key: K }>> };
