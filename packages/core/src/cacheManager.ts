type CacheResolver<TKey, TValue> = (key: TKey) => Promise<TValue>;

export class CacheManager<TKey, TValue> {
    private readonly map = new Map<TKey, TValue>();

    public constructor(
        private readonly resolver: CacheResolver<TKey, TValue>,
        private readonly expire: number
    ) {}

    public async get(key: TKey): Promise<TValue> {
        const value = this.map.get(key);
        if (value) {
            return value;
        }
        const newValue = await this.resolver(key);
        this.map.set(key, newValue);
        setTimeout(this.map.delete.bind(this.map), this.expire, key);
        return newValue;
    }
}
