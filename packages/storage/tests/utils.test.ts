import { CacheResult } from "@replikit/storage";

class Counter {
    count = 0;

    @CacheResult
    getCount(): number {
        this.count++;
        return this.count;
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
});
