import {
    Entity,
    Repository,
    RepositoryNotRegisteredError,
    RepositoryExtensionNotRegisteredError
} from "@replikit/storage";
import { DatabaseTestManager } from "@replikit/test-utils";

let testManager: DatabaseTestManager;

beforeEach(() => {
    testManager = new DatabaseTestManager();
    return testManager.connect();
});

afterEach(() => {
    return testManager.close();
});

class TestEntity extends Entity {}

class TestEntityRepository extends Repository<TestEntity> {}

describe("ConnectionManager", () => {
    it("should register and get repository", () => {
        const connection = testManager.connection;
        const registered = connection.registerRepository("tests", TestEntity, {
            autoIncrement: true
        });

        const repository = connection.getRepository(TestEntity);
        expect(repository).toBe(registered);
        expect(repository).toBeInstanceOf(Repository);
    });

    it("should throw an error if repository not registered", () => {
        const connection = testManager.connection;
        expect(() => connection.getRepository(TestEntity)).toThrow(RepositoryNotRegisteredError);
    });

    it("should register and get repository extension", () => {
        const connection = testManager.connection;
        connection.registerRepository("tests", TestEntity);
        const registered = connection.registerRepositoryExtension(TestEntity, TestEntityRepository);

        const repository = connection.getRepository(TestEntityRepository);
        expect(repository).toBe(registered);
        expect(repository).toBeInstanceOf(TestEntityRepository);
    });

    it("should throw an error if repository extension not registered", () => {
        const connection = testManager.connection;
        const action = () => void connection.getRepository(TestEntityRepository);
        expect(action).toThrow(RepositoryExtensionNotRegisteredError);
    });
});
