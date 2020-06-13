import { Attachment, ChannelEventPayload } from "@replikit/core/typings";

export interface ChannelPhotoEventPayload extends ChannelEventPayload {
    photo: Attachment;
}
