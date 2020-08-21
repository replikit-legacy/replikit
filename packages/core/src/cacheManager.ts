type CacheResolver<TKey, TValue> = (key: TKey) => Promise<TValue>;

export class CacheManager<TKey, TValue> {
    private readonly storage = new Map<TKey, TValue>();

    constructor(
        private readonly resolver: CacheResolver<TKey, TValue>,
        private readonly expire: number
    ) {}

    async get(key: TKey): Promise<TValue> {
        const value = this.storage.get(key);
        if (value) {
            return value;
        }
        const newValue = await this.resolver(key);
        this.storage.set(key, newValue);
        setTimeout(this.storage.delete.bind(this.storage), this.expire, key);
        return newValue;
    }
}
