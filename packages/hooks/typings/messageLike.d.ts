import { OutMessage } from "@replikit/core/typings";
import { MessageBuilder } from "@replikit/messages";

type _SyncMessageLike = OutMessage | MessageBuilder | void;

export type MessageLike = _SyncMessageLike | Promise<_SyncMessageLike>;
