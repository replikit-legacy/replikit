import { Entity, loadExtensions } from "@replikit/storage";
import { HasFields } from "@replikit/core/typings";

class TestExtension {
    static readonly key = "test";

    test?: number;

    getTest(): number {
        return this.test ?? 0;
    }
}

describe("Entity", () => {
    it("should load extension by type", () => {
        const entity = new Entity();
        entity.loadExtension(TestExtension);
        expect(((entity as unknown) as HasFields).test).toBeInstanceOf(TestExtension);
    });

    it("should get extension by type", () => {
        const entity = new Entity();
        const extension = entity.getExtension(TestExtension);
        expect(extension).toBeInstanceOf(TestExtension);
    });

    it("should load extension from existing plain object", () => {
        const entity = new Entity();
        ((entity as unknown) as HasFields).test = { test: 123 };
        const extension = entity.getExtension(TestExtension);
        expect(extension).toBeDefined();
        expect(extension.getTest()).toBe(123);
    });

    it("should load extensions using loadExtensions helper", () => {
        const entity = new Entity();
        loadExtensions(entity, TestExtension);
        expect(entity.test.getTest()).toBe(0);
    });
});
