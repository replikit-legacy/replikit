import { Identifier } from "@replikit/core/typings";

export interface MemberId {
    controller: string;
    channelId: Identifier;
    accountId: Identifier;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Member {}
