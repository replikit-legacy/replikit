import { User, Channel, Member } from "@replikit/storage/typings";

export interface CollectionMap {
    users: User;
    channels: Channel;
    members: Member;
}

export type CollectionName = keyof CollectionMap;
