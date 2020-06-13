/* eslint-disable @typescript-eslint/no-explicit-any */

function isObject(item: any): boolean {
    return item !== null && typeof item === "object";
}

function isMergebleObject(item: any): boolean {
    return isObject(item) && !Array.isArray(item);
}

// https://stackoverflow.com/a/46973278/10502674
export function deepmerge<T extends any = any>(target: T, ...sources: T[]): T {
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
                    target[key] = {};
                }
                deepmerge(target[key], source[key]);
            } else {
                target[key] = source[key];
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
    const timezoneHoursText =
        timezoneHours > 0 ? "+" + timezoneHoursPadded : timezoneHoursPadded;
    const timezoneMinutes = pad(timezone % 60);
    const timezoneText = !omitOffset
        ? ` GMT${timezoneHoursText}:${timezoneMinutes} `
        : " ";
    return `${year}-${month}-${day}${timezoneText}${hours}:${minutes}:${seconds}`;
}

type Group<T, K extends keyof T> = { key: T[K]; value: T[] };

export function groupBy<T, K extends keyof T>(
    arr: readonly T[],
    key: K
): Group<T, K>[] {
    // TODO fix
    const temp = arr.reduce<any>((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
    const result = [];
    for (const key of Object.keys(temp)) {
        result.push({ key: key as any, value: temp[key] });
    }
    return result;
}

export function applyMixins(target: Function, mixins: Function[]): void {
    for (const mixin of mixins) {
        const properties = Object.getOwnPropertyNames(mixin.prototype);
        for (const property of properties) {
            if (property === "constructor") {
                continue;
            }
            const desc = Object.getOwnPropertyDescriptor(
                mixin.prototype,
                property
            )!;
            Object.defineProperty(target.prototype, property, desc);
        }
    }
}

export const Extension: ClassDecorator = (target): void => {
    const base = Object.getPrototypeOf(target.prototype).constructor;
    applyMixins(base, [target]);
};
