import { Transform } from "class-transformer";

export const Embedded = Transform(
    (value, obj) => {
        Array.isArray(value)
            ? value.forEach(v => void (v.repository = obj.__repository))
            : (value.repository = obj.__repository);
        return value as unknown;
    },
    { toClassOnly: true }
);
