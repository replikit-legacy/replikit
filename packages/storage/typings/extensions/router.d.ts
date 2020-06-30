import "@replikit/router/typings";
import { Channel, User, FallbackStrategy, Member, ConnectionManager } from "@replikit/storage";

declare module "@replikit/router/typings/context/channelContext" {
    export interface ChannelContext {
        getChannel(fallbackStrategy?: FallbackStrategy): Promise<Channel>;
    }
}

declare module "@replikit/router/typings/context/accountContext" {
    export interface AccountContext {
        connection: ConnectionManager;
        getUser(fallbackStrategy?: FallbackStrategy): Promise<User>;
        getMember(fallbackStrategy?: FallbackStrategy): Promise<Member>;
        getChannelMember(channelId: number): Promise<Member | undefined>;
    }
}
