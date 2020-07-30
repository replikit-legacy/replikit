import { ChannelContext } from "@replikit/router";
import { MemberEvent, AccountInfo } from "@replikit/core/typings";
import {
    MemberContext as _MemberContext,
    AccountContext as _AccountContext
} from "@replikit/router/typings";

export class MemberContext<T extends MemberEvent = MemberEvent> extends ChannelContext<T> {
    get account(): AccountInfo {
        return this.payload.account;
    }
}

export interface MemberContext extends _MemberContext, _AccountContext {}
