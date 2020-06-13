export class BetStorage {
    private readonly betMap = new Map<number, number>();

    bet(userId: number, amount: number): boolean {
        if (this.betMap.has(userId)) {
            return false;
        }
        this.betMap.set(userId, amount);
        return true;
    }

    getBet(userId: number): number | undefined {
        const amount = this.betMap.get(userId);
        if (amount === undefined) {
            return undefined;
        }
        this.betMap.delete(userId);
        return amount;
    }
}

export const betStorage = new BetStorage();
