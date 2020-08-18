import { Repository, Channel } from "@replikit/storage";

export class ChannelRepository extends Repository<Channel> {
    findByLocal(controller: string, localId: number): Promise<Channel | undefined> {
        return this.findOne({ controller, localId });
    }
}
