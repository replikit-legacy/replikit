import { Repository, UnlinkedEntityError } from "@replikit/storage";
import { Exclude } from "class-transformer";
import { Entity as _Entity } from "@replikit/storage/typings";

export class Entity {
    @Exclude()
    protected repository: Repository;

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
