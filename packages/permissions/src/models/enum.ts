interface Countable {
    count?: number;
}

export abstract class EnumInstance {
    index: number;
    id: string;
    name: string;

    constructor() {
        const countable = this.constructor as Countable;
        countable.count = countable.count !== undefined ? countable.count + 1 : 0;
        this.index = countable.count;
    }
}

export function Enum(name: string): ClassDecorator {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return <T extends Function>(target: T) => {
        for (const key of Object.getOwnPropertyNames(target)) {
            const value = target[key as keyof typeof target];
            if (value instanceof EnumInstance) {
                value.name = key;
                value.id = `${name}${value.index}`;
            }
        }
        return target;
    };
}
