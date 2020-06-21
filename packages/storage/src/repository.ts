import { Collection, OptionalId, FilterQuery } from "mongodb";
import { Constructor } from "@replikit/core/typings";
import { plainToClass, classToPlain } from "class-transformer";
import { Entity, ConnectionManager } from "@replikit/storage";
import { PlainObject, RepositoryOptions } from "@replikit/storage/typings";

export class Repository<T extends Entity = Entity> {
    private readonly defaults: Partial<T> = {};

    constructor(
        readonly connection: ConnectionManager,
        readonly collection: Collection<PlainObject<T>>,
        private readonly ctr: Constructor<T>,
        private readonly options: RepositoryOptions = {}
    ) {
        this.createEntity = this.createEntity.bind(this);
    }

    create(plain?: Partial<PlainObject<T>>): T {
        return this.createEntity((plain as PlainObject<T>) ?? {});
    }

    async findOne(filter: FilterQuery<PlainObject<T>>): Promise<T | undefined> {
        const document = await this.collection.findOne(filter);
        return document ? this.createEntity(document) : undefined;
    }

    async find(filter?: FilterQuery<PlainObject<T>>): Promise<T[]> {
        const documents = await this.collection.find(filter).toArray();
        return this.createEntities(documents);
    }

    async delete(entity: T): Promise<void> {
        await this.collection.deleteOne(({
            _id: entity._id
        } as unknown) as PlainObject<T>);
    }

    async save(entity: T): Promise<void> {
        type Value = OptionalId<PlainObject<T>>;
        const value = classToPlain(entity) as Entity;
        if (!entity._id) {
            if (this.options.autoIncrement) {
                const name = this.collection.collectionName;
                value._id = await this.connection.getNextId(name);
            }
            await this.collection.insertOne((value as unknown) as Value);
            entity._id = value._id;
            return;
        }

        await this.collection.replaceOne(
            ({ _id: entity._id } as unknown) as PlainObject<T>,
            (value as unknown) as PlainObject<T>
        );
    }

    protected createEntities(documents: PlainObject<T>[]): T[] {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        return documents.map(this.createEntity);
    }

    setDefault<K extends keyof T>(key: K, value: T[K]): void {
        this.defaults[key] = value;
    }

    createEntity(document: PlainObject<T>): T {
        const plain = Object.assign({}, this.defaults, document);
        const entity = plainToClass(this.ctr, plain);
        entity["repository"] = (this as unknown) as Repository;
        return entity;
    }

    createDocument(entity: T): PlainObject<T> {
        return classToPlain(entity) as PlainObject<T>;
    }
}
