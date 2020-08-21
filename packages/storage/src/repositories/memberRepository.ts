import { Repository, Member } from "@replikit/storage";
import { Identifier } from "@replikit/core/typings";

export class MemberRepository extends Repository<Member> {
    findByLocal(
        controller: string,
        channelId: Identifier,
        accountId: Identifier
    ): Promise<Member | undefined> {
        return this.findOne({ _id: { controller, channelId, accountId } });
    }
}
