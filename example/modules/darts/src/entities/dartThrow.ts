import { DartThrow as _DartThrow } from "@example/darts/typings";
import { Entity, User, CacheResult } from "@replikit/storage";
import { UserNotFoundError } from "@replikit/storage";

export class DartThrow extends Entity {
    @CacheResult
    async getUser(): Promise<User> {
        const repo = this.repository.connection.getRepository(User);
        const user = await repo.findOne({ _id: this.userId });
        if (!user) {
            throw new UserNotFoundError();
        }
        return user;
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DartThrow extends _DartThrow {}
