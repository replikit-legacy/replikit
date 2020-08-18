import { Repository, Member } from "@replikit/storage";

export class MemberRepository extends Repository<Member> {
    findByLocal(
        controller: string,
        channelId: number,
        accountId: number
    ): Promise<Member | undefined> {
        return this.findOne({ _id: { controller, channelId, accountId } });
    }
}
