import {
    CompositionFactory,
    createCompositionInfo,
    createCompositionInstance
} from "@replikit/core";

interface CompositionContext {
    a: number;
}

interface ExecutionContext {
    b: number;
}

const testComposer = new CompositionFactory<CompositionContext, ExecutionContext>();

function testField(): number {
    return testComposer.compose(ctx => {
        return { get: rc => ctx.a + rc.b };
    });
}

function testFieldWithInit(): number {
    return testComposer.compose(() => {
        return { get: rc => rc.b, init: rc => (rc.b = 123) };
    });
}

interface TestFields {
    test1: number;
    test2: number;
}

function useTestFields(): TestFields {
    const test1 = testField();
    const test2 = testField();
    return { test1, test2 };
}

function useTestFieldsWithInit(): TestFields {
    const test1 = testFieldWithInit();
    const test2 = testFieldWithInit();
    return { test1, test2 };
}

describe("composition", () => {
    it("should extract composition info from class", () => {
        class Test {
            field = testField();

            multiply(): number {
                return this.field * 2;
            }
        }

        const info = createCompositionInfo(Test, { a: 1 });
        const test = createCompositionInstance<Test>(info, { b: 2 });
        expect(test.multiply()).toBe(6);
    });

    it("should extract composition info from class with hooks", () => {
        class Test {
            fields = useTestFields();

            sum(): number {
                return this.fields.test1 + this.fields.test2;
            }
        }

        const info = createCompositionInfo(Test, { a: 1 });
        const test = createCompositionInstance<Test>(info, { b: 2 });
        expect(test.sum()).toBe(6);
    });

    it("should apply init hooks from composition items", () => {
        class Test {
            field = testFieldWithInit();
        }

        const info = createCompositionInfo(Test, {});
        const test = createCompositionInstance<Test>(info, {});
        expect(test.field).toBe(123);
    });

    it("should apply init hooks from nested composition root", () => {
        class Test {
            fields = useTestFieldsWithInit();
        }

        const info = createCompositionInfo(Test, {});
        const test = createCompositionInstance<Test>(info, {});
        expect(test.fields.test1).toBe(123);
        expect(test.fields.test2).toBe(123);
        expect(test).toHaveProperty("b", 123);
    });
});
