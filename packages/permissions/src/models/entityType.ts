export class EntityType<T extends string = string> {
    _entityTypeBrand: void;

    static readonly User = new EntityType("User");
    static readonly Member = new EntityType("Member");

    equals(other: EntityType): boolean {
        return this.name === other.name;
    }

    constructor(public name: T) {}
}
