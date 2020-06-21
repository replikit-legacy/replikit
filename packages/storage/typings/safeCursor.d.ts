import { Cursor, FilterQuery } from "mongodb";

export interface SafeCursor<T> extends Cursor<T> {
    filter(query: FilterQuery<T>): this;
}
