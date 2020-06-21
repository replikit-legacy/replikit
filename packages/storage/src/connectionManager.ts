import { MongoClient, Collection, Db } from "mongodb";
import { Constructor } from "@replikit/core/typings";
import {
    Repository,
    Entity,
    RepositoryNotRegisteredError,
    NextIdDetectionError
} from "@replikit/storage";
import {
    PlainObject,
    RepositoryOptions,
    Counter
} from "@replikit/storage/typings";

export class ConnectionManager {
    private client: MongoClient;
    private db: Db;

    private readonly rawCollectionMap = new Map<string, Collection>();
    private readonly repositoryMap = new Map<Constructor, Repository>();

    async connect(uri: string): Promise<void> {
        this.client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await this.client.connect();
        this.db = this.client.db();
    }

    async close(): Promise<void> {
        await this.client.close();
    }

    async getNextId(collection: string): Promise<number> {
        const repo = this.getRawCollection<Counter>("counters");
        const counter = await repo.findOneAndUpdate(
            { _id: collection },
            { $inc: { value: 1 } },
            { upsert: true, returnOriginal: false }
        );
        if (!counter.ok) {
            throw new NextIdDetectionError(collection);
        }
        return counter.value!.value;
    }

    getRawCollection<T>(name: string): Collection<T> {
        let collection = this.rawCollectionMap.get(name);
        if (!collection) {
            collection = this.db.collection(name);
            this.rawCollectionMap.set(name, collection);
        }
        return collection as Collection<T>;
    }

    getCollection<T extends Entity>(
        constructor: Constructor<T>
    ): Collection<PlainObject<T>> {
        const repository = this.getRepository(constructor);
        return repository.collection;
    }

    registerRepository<T extends Entity>(
        name: string,
        constructor: Constructor<T>,
        options: RepositoryOptions = {}
    ): Repository<T> {
        const collection = this.db.collection(name);
        const repository = new Repository(
            this,
            collection,
            constructor,
            options
        );
        this.repositoryMap.set(
            constructor,
            (repository as unknown) as Repository<Entity>
        );
        return repository;
    }

    getRepository<T extends Entity>(
        constructor: Constructor<T>
    ): Repository<T> {
        const repository = this.repositoryMap.get(constructor);
        if (!repository) {
            throw new RepositoryNotRegisteredError(constructor);
        }
        return (repository as unknown) as Repository<T>;
    }
}
