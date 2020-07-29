import { Repository, UnlinkedEntityError } from "@replikit/storage";
import { Exclude, plainToClass } from "class-transformer";
import { Entity as _Entity, EntityExtensionConstructor } from "@replikit/storage/typings";
import { HasFields } from "@replikit/core/typings";

export class Entity {
    @Exclude()
    protected repository: Repository;

    loadExtension(type: EntityExtensionConstructor): void {
        const hasFields = this as HasFields;
        if (!hasFields[type.key]) {
            hasFields[type.key] = new type();
            return;
        }
        if (hasFields[type.key] instanceof type) {
            return;
        }
        hasFields[type.key] = plainToClass(type, hasFields[type.key]);
    }

    getExtension<T>(type: EntityExtensionConstructor<T>): T {
        this.loadExtension(type);
        return (this as HasFields)[type.key] as T;
    }

    save(): Promise<void> {
        if (!this.repository) {
            throw new UnlinkedEntityError("save");
        }
        return this.repository.save(this);
    }

    delete(): Promise<void> {
        if (!this.repository) {
            throw new UnlinkedEntityError("delete");
        }
        return this.repository.delete(this);
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entity extends _Entity {}
