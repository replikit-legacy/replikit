import { Collection, OptionalId, FilterQuery, Cursor } from "mongodb";
import { Constructor, HasFields } from "@replikit/core/typings";
import { plainToClass, classToPlain } from "class-transformer";
import { Entity, ConnectionManager } from "@replikit/storage";
import {
    PlainObject,
    RepositoryOptions,
    SafeCursor
} from "@replikit/storage/typings";

// eslint-disable-next-line @typescript-eslint/ban-types
export type QueryBuilder<T extends object> = (
    q: SafeCursor<PlainObject<T>>
) => SafeCursor<PlainObject<T>>;

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

    async findMany(filter?: FilterQuery<PlainObject<T>>): Promise<T[]> {
        const documents = await this.collection.find(filter).toArray();
        return this.createEntities(documents);
    }

    async fetchEntities(cursor: Cursor<PlainObject<T>>): Promise<T[]> {
        const documents = await cursor.toArray();
        return this.createEntities(documents);
    }

    async query(builder: QueryBuilder<T>): Promise<T[]> {
        const cursor = this.collection.find();
        return this.fetchEntities(builder(cursor));
    }

    async delete(entity: T): Promise<void> {
        await this.collection.deleteOne(({
            _id: entity._id
        } as unknown) as FilterQuery<PlainObject<T>>);
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
            ({ _id: entity._id } as unknown) as FilterQuery<PlainObject<T>>,
            (value as unknown) as PlainObject<T>,
            { upsert: true }
        );
    }

    createEntities(documents: PlainObject<T>[]): T[] {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        return documents.map(this.createEntity);
    }

    setDefault<K extends keyof T>(key: K, value: T[K]): void {
        this.defaults[key] = value;
    }

    createEntity(document: PlainObject<T>): T {
        const plain = Object.assign({}, this.defaults, document);
        (plain as HasFields).__repository = this;
        const entity = plainToClass(this.ctr, plain, {
            excludePrefixes: ["__"]
        });
        (entity as HasFields).repository = this;
        return entity;
    }

    createDocument(entity: T): PlainObject<T> {
        return classToPlain(entity) as PlainObject<T>;
    }
}
