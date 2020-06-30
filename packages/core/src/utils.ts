import { Constructor, HasFields, ControllerName, ControllerMap } from "@replikit/core/typings";
import { Controller } from "@replikit/core";

function isObject(item: unknown): boolean {
    return item !== null && typeof item === "object";
}

function isMergebleObject(item: unknown): boolean {
    return isObject(item) && !Array.isArray(item);
}

// https://stackoverflow.com/a/46973278/10502674
export function deepmerge<T extends HasFields = HasFields>(target: T, ...sources: T[]): T {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();
    if (source === undefined) {
        return target;
    }

    if (isMergebleObject(target) && isMergebleObject(source)) {
        Object.keys(source).forEach(key => {
            if (isMergebleObject(source[key])) {
                if (!target[key]) {
                    target[key as keyof T] = {} as T[keyof T];
                }
                deepmerge(target[key] as HasFields, source[key] as HasFields);
            } else {
                target[key as keyof T] = source[key] as T[keyof T];
            }
        });
    }

    return deepmerge(target, ...sources);
}

// https://stackoverflow.com/a/10456644/10502674
export function chunk<T>(arr: T[], size: number): T[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

function pad(num: number): string {
    return num.toString().padStart(2, "0");
}

export function renderDate(date: Date, omitOffset = false): string {
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const year = date.getFullYear().toString();
    const month = pad(date.getMonth());
    const day = pad(date.getDate());
    const timezone = date.getTimezoneOffset();
    const timezoneHours = -Math.floor(timezone / 60);
    const timezoneHoursPadded = pad(timezoneHours);
    const timezoneHoursText = timezoneHours > 0 ? "+" + timezoneHoursPadded : timezoneHoursPadded;
    const timezoneMinutes = pad(timezone % 60);
    const timezoneText = !omitOffset ? ` GMT${timezoneHoursText}:${timezoneMinutes} ` : " ";
    return `${year}-${month}-${day}${timezoneText}${hours}:${minutes}:${seconds}`;
}

type Group<T, K extends keyof T> = { key: T[K]; value: T[] };

export function groupBy<T, K extends keyof T>(arr: readonly T[], key: K): Group<T, K>[] {
    const map = new Map<T[K], Group<T, K>>();
    for (const item of arr) {
        let group = map.get(item[key]);
        if (group) {
            group.value.push(item);
            continue;
        }
        group = { key: item[key], value: [item] };
        map.set(item[key], group);
    }
    return Array.from(map.values());
}

export function applyMixins(target: Constructor, mixins: Constructor[]): void {
    for (const mixin of mixins) {
        const properties = Object.getOwnPropertyNames(mixin.prototype);
        for (const property of properties) {
            if (property === "constructor") {
                continue;
            }
            const desc = Object.getOwnPropertyDescriptor(mixin.prototype, property)!;
            Object.defineProperty(target.prototype, property, desc);
        }
    }
}

export const Extension: ClassDecorator = (target): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const base = Object.getPrototypeOf(target.prototype).constructor as Constructor;
    applyMixins(base, [(target as unknown) as Constructor]);
};

export function checkController<N extends ControllerName>(
    name: N,
    controller: Controller
): controller is ControllerMap[N] {
    return controller.name === name;
}
