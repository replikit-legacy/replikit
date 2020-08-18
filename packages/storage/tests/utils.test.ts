import { CacheResult, User, loadExtensions, Memoize } from "@replikit/storage";
import { TestExtension } from "@replikit/storage/tests";
import { HasFields } from "@replikit/core/typings";

class Counter {
    count = 0;

    @CacheResult
    getCount(): number {
        this.count++;
        return this.count;
    }

    @Memoize
    getMultipliedCount(multiplier: number): number {
        this.count++;
        return this.count * multiplier;
    }
}

describe("CacheResult", () => {
    it("should use a cached result instead of calling the method", () => {
        const counter = new Counter();

        expect(counter.count).toBe(0);
        expect(counter.getCount()).toBe(1);
        expect(counter.count).toBe(1);
        expect(counter.getCount()).toBe(1);
        expect(counter.count).toBe(1);
    });

    it("should use a memoized result instead of calling the method", () => {
        const counter = new Counter();

        expect(counter.count).toBe(0);

        expect(counter.getMultipliedCount(1)).toBe(1);
        expect(counter.count).toBe(1);
        expect(counter.getMultipliedCount(1)).toBe(1);
        expect(counter.count).toBe(1);

        expect(counter.getMultipliedCount(2)).toBe(4);
        expect(counter.count).toBe(2);
        expect(counter.getMultipliedCount(2)).toBe(4);
        expect(counter.count).toBe(2);
    });

    it("should create and load extension", () => {
        const user = new User();
        loadExtensions(user, TestExtension);
        expect(user.test).toBeInstanceOf(TestExtension);
        expect(user.test.test).toBe(123);
    });

    it("should load extension from plain object", () => {
        const user = new User();
        ((user as unknown) as HasFields).test = { test: 456 };
        loadExtensions(user, TestExtension);
        expect(user.test).toBeInstanceOf(TestExtension);
        expect(user.test.test).toBe(456);
    });
});
