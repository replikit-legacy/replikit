type CacheResolver<TKey, TValue> = (key: TKey) => Promise<TValue>;

export class CacheManager<TKey, TValue> {
    private readonly storage = new Map<TKey, TValue>();

    constructor(
        private readonly resolver: CacheResolver<TKey, TValue>,
        private readonly expire: number
    ) {}

    async get(key: TKey): Promise<TValue> {
        if (this.storage.has(key)) {
            return this.storage.get(key)!;
        }
        const value = await this.resolver(key);
        this.storage.set(key, value);
        setTimeout(this.storage.delete.bind(this.storage), this.expire, key);
        return value;
    }
}
