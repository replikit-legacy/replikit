import { OutMessage } from "@replikit/core/typings";
import { MessageBuilder } from "@replikit/messages";

export type OutMessageLike = OutMessage | MessageBuilder | string;

export type OutMessageLikeAsync = OutMessageLike | Promise<OutMessageLike>;
