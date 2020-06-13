import {
    ChannelInfo,
    AccountInfo,
    HasId,
    Attachment,
    MessageMetadata,
    ForwardedMessage
} from "@replikit/core/typings";

export interface InMessage extends HasId {
    channel: ChannelInfo;
    account: AccountInfo;
    text?: string;
    attachments: Attachment[];
    reply?: InMessage;
    forwarded: ForwardedMessage[];
    metadata: MessageMetadata;
}
