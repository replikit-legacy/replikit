import { Repository, Channel } from "@replikit/storage";
import { Identifier } from "@replikit/core/typings";

export class ChannelRepository extends Repository<Channel> {
    findByLocal(controller: string, localId: Identifier): Promise<Channel | undefined> {
        return this.findOne({ controller, localId });
    }
}
