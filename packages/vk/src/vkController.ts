import {
    Controller,
    config,
    AttachmentType,
    TextTokenizer,
    TextTokenKind,
    ChannelType,
    TextFormatter,
    assertType
} from "@replikit/core";
import {
    ChannelInfo,
    ResolvedMessage,
    AccountInfo,
    SendedMessage,
    InMessage,
    Attachment,
    ResolvedAttachment,
    SendedAttachment,
    ForwardedMessage,
    MessageMetadata,
    Identifier
} from "@replikit/core/typings";
import {
    VK,
    MessageContext,
    PhotoAttachment,
    AudioMessageAttachment,
    StickerAttachment,
    Attachment as VKAttachment,
    ExternalAttachment,
    getRandomId,
    DocumentAttachment
} from "vk-io";
import { UsersUserXtrCounters } from "vk-io/lib/api/schemas/objects";

function createSendedAttachment(attachment: ResolvedAttachment): SendedAttachment {
    return { origin: attachment, id: attachment.source };
}

export class VKController extends Controller {
    readonly backend: VK;

    constructor() {
        const textTokenizer = new TextTokenizer()
            .addRegexRule(/\[id(\d*)\|(.*)]/, groups => ({
                kind: TextTokenKind.Mention as const,
                id: +groups[1],
                text: groups[2],
                props: []
            }))
            .addRegexRule(/\[club(\d*)\|(.*)]/, groups => ({
                kind: TextTokenKind.Link as const,
                url: `https://vk.com/public${groups[1]}`,
                text: groups[2],
                props: []
            }));

        const textFormatter = new TextFormatter()
            .addVisitor(TextTokenKind.Mention, token => {
                return `[id${token.id}|${token.text}]`;
            })
            .addVisitor(TextTokenKind.Link, token => {
                const regex = /https:\/\/vk\.com\/public(\d+)/;
                const match = regex.exec(token.url);
                if (match) {
                    return `[public${match[1]}|${token.text}]`;
                }
                return `${token.text} (${token.url})`;
            });

        super({
            name: "vk",
            textTokenizer,
            textFormatter
        });

        this.backend = new VK({
            token: config.vk.token,
            pollingGroupId: config.vk.pollingGroup
        });

        this.backend.updates.on("message_new", async context => {
            if (context.senderType === "user") {
                const message = await this.createMessage(context);
                this.processMessageEvent("message:received", message);
            }
        });

        this.backend.updates.on("message_edit", async context => {
            if (context.senderType === "user") {
                const message = await this.createMessage(context);
                this.processMessageEvent("message:edited", message);
            }
        });
    }

    async start(): Promise<void> {
        const resp = await this.backend.api.groups.getById({
            group_id: config.vk.pollingGroup.toString()
        });
        this._botInfo = { id: config.vk.pollingGroup, username: resp[0].screen_name };
        await this.backend.updates.start();
    }

    async stop(): Promise<void> {
        await this.backend.updates.stop();
    }

    private createIdRequest(channelId: number, id: Identifier): string {
        assertType(id, "number", "message id");
        return `
            var resp = API.messages.getByConversationMessageId({ 
                peer_id: ${channelId}, 
                conversation_message_ids: [${id}]  
            });
            var messageId = resp.items[0].id;
        `;
    }

    async deleteMessage(channelId: number, metadata: MessageMetadata): Promise<void> {
        if (metadata.globalId) {
            await this.backend.api.messages.delete({
                delete_for_all: true,
                message_ids: [metadata.globalId]
            });
            return;
        }
        const request = this.createIdRequest(channelId, metadata.messageIds[0]);
        await this.backend.api.execute({
            code: `
                ${request}
                API.messages.delete({
                    delete_for_all: true,
                    message_ids: [messageId]
                });
            `
        });
    }

    protected async fetchChannelInfo(localId: number): Promise<ChannelInfo | undefined> {
        const conversations = await this.backend.api.messages.getConversationsById({
            peer_ids: [localId]
        });
        const conversation = conversations.items[0];
        if (!conversation) {
            return undefined;
        }

        const canWrite = conversation.can_write?.allowed;
        if (conversation.peer?.type === "user") {
            const user = await this.getAccountInfo(localId);
            if (!user) {
                return undefined;
            }
            return {
                id: localId,
                title: `${user.firstName} ${user.lastName}`,
                type: ChannelType.Direct,
                permissions: {
                    sendMessages: canWrite,
                    deleteMessages: canWrite,
                    editMessages: canWrite,
                    deleteOtherMessages: false
                }
            };
        }
        const canManage = conversation.chat_settings?.owner_id === -config.vk.pollingGroup;
        return {
            id: localId,
            title: conversation.chat_settings?.title,
            type: ChannelType.Group,
            permissions: {
                sendMessages: canWrite,
                editMessages: canManage,
                deleteMessages: canManage,
                deleteOtherMessages: canManage
            }
        };
    }

    protected async uploadAttachment(
        channelId: number,
        attachment: Attachment
    ): Promise<string | undefined> {
        switch (attachment.type) {
            case AttachmentType.Photo:
            case AttachmentType.Sticker: {
                const uploaded = await this.backend.upload.messagePhoto({
                    source: { value: attachment.url! }
                });
                return uploaded.toString();
            }
            case AttachmentType.Voice: {
                const uploaded = await this.backend.upload.audioMessage({
                    source: { value: attachment.url! },
                    peer_id: channelId
                });
                return uploaded.toString();
            }
            case AttachmentType.Video: {
                const uploaded = await this.backend.upload.video({
                    source: { value: attachment.url! },
                    is_private: 1
                });
                return uploaded.toString();
            }
        }
        return undefined;
    }

    protected async fetchAccountInfo(localId: number): Promise<AccountInfo | undefined> {
        if (localId > 0) {
            const [user] = await this.backend.api.users.get({
                user_ids: [localId.toString()],
                fields: ["screen_name", "photo_100"]
            });
            return user && this.createAccountInfoByUser(user);
        }

        const groups = await this.backend.api.groups.getById({
            group_id: Math.abs(localId).toString()
        });
        const group = groups[0];
        if (!group) return;
        return {
            id: localId,
            username: group.screen_name,
            firstName: group.name
        };
    }

    private createAccountInfoByUser(user: UsersUserXtrCounters): AccountInfo {
        return {
            id: user.id,
            username: user.screen_name,
            firstName: user.first_name,
            lastName: user.last_name,
            avatar: {
                id: undefined!,
                type: AttachmentType.Photo,
                url: user.photo_100?.toString()
            }
        };
    }

    private formatAttachments(attachments: ResolvedAttachment[]): string {
        return attachments.map(x => x.source).join(",");
    }

    protected async sendResolvedMessage(
        channelId: number,
        message: ResolvedMessage
    ): Promise<SendedMessage | undefined> {
        let result: SendedMessage | undefined;

        const attachments = message.attachments.filter(
            x => x.type !== AttachmentType.Sticker || x.controllerName !== this.name
        );

        if (attachments.length || message.text) {
            const serializedAttachments = this.formatAttachments(attachments);
            if (message.reply && !message.reply.globalId) {
                const request = this.createIdRequest(channelId, message.reply.messageIds[0]);
                const data = await this.backend.api.execute({
                    code: `
                        ${request}
                        return API.messages.send({
                            random_id: ${getRandomId()},
                            peer_id: ${channelId},
                            message: ${JSON.stringify(message.text ?? "")},
                            reply_to: messageId,
                            attachment: "${serializedAttachments}"
                        });
                    `
                });
                const sended = data.response;
                result = this.createSendedMessage(sended, attachments);
            } else {
                const sended = await this.backend.api.messages.send({
                    peer_id: channelId,
                    message: message.text ?? "",
                    reply_to: message.reply?.globalId ?? 0,
                    attachment: serializedAttachments,
                    random_id: getRandomId()
                });
                result = this.createSendedMessage(sended, attachments);
            }
        }

        const sticker = message.attachments.find(x => x.type === AttachmentType.Sticker);
        if (sticker && sticker.controllerName === this.name) {
            let sended: number;
            const stickerId = parseInt(sticker.id);
            if (message.reply && !message.reply.globalId) {
                const request = this.createIdRequest(channelId, message.reply.messageIds[0]);
                const data = await this.backend.api.execute({
                    code: `
                        ${request}
                        return API.messages.send({
                            random_id: ${getRandomId()},
                            peer_id: channelId,
                            sticker_id: ${stickerId},
                            reply_to: messageId
                        });
                    `
                });
                sended = data.response;
            } else {
                sended = await this.backend.api.messages.send({
                    peer_id: channelId,
                    sticker_id: stickerId,
                    reply_to: message.reply?.globalId ?? 0,
                    random_id: getRandomId()
                });
            }
            if (!result) {
                result = this.createSendedMessage(sended, [sticker]);
            } else {
                result.attachments.push(createSendedAttachment(sticker));
            }
        }

        return result;
    }

    private createSendedMessage(id: number, attachments: ResolvedAttachment[]): SendedMessage {
        return {
            attachments: attachments.map(createSendedAttachment),
            metadata: { globalId: id, messageIds: [0] }
        };
    }

    protected async editResolvedMessage(
        channelId: number,
        message: ResolvedMessage
    ): Promise<SendedMessage> {
        const attachments = this.formatAttachments(message.attachments);

        if (message.metadata.globalId) {
            const messageId = message.metadata.globalId;
            await this.backend.api.messages.edit({
                peer_id: channelId,
                message_id: messageId,
                message: message.text,
                attachment: attachments
            });
            return this.createSendedMessage(messageId, message.attachments);
        }

        const messageId = message.metadata.messageIds[0];
        assertType(messageId, "number", "message id");
        const request = this.createIdRequest(channelId, messageId);
        await this.backend.api.execute({
            code: `
                ${request}
                API.messages.edit({
                    peer_id: ${channelId},
                    message_id: messageId,
                    message: ${JSON.stringify(message.text)},
                    attachment: "${attachments}"
                });
            `
        });
        return this.createSendedMessage(messageId, message.attachments);
    }

    private createChannel(channelId: number): ChannelInfo {
        return {
            id: channelId,
            type: ChannelType.Unknown,
            permissions: {
                deleteMessages: false,
                editMessages: false,
                sendMessages: false,
                deleteOtherMessages: false
            }
        };
    }

    private createAccount(accountId: number): AccountInfo {
        return { id: accountId };
    }

    private async resolveChannel(channelId: number): Promise<ChannelInfo> {
        const channel = await this.getChannelInfo(channelId);
        return channel ?? this.createChannel(channelId);
    }

    private async resolveAccount(accountId: number): Promise<AccountInfo> {
        const account = await this.getAccountInfo(accountId);
        return account ?? this.createAccount(accountId);
    }

    private extractAttachments(
        attachments: (VKAttachment<unknown> | ExternalAttachment<unknown>)[]
    ): Attachment[] {
        const result: Attachment[] = [];
        for (const attachment of attachments) {
            switch (attachment.type) {
                case "photo": {
                    const photoAttachment = attachment as PhotoAttachment;
                    result.push({
                        type: AttachmentType.Photo,
                        id: photoAttachment.toString(),
                        url: photoAttachment.largeSizeUrl!
                    });
                    break;
                }
                case "audio_message": {
                    const voiceAttachment = attachment as AudioMessageAttachment;
                    result.push({
                        type: AttachmentType.Voice,
                        id: voiceAttachment.toString(),
                        url: voiceAttachment.oggUrl!
                    });
                    break;
                }
                case "sticker": {
                    const stickerAttachment = attachment as StickerAttachment;
                    const images = stickerAttachment.images;
                    result.push({
                        type: AttachmentType.Sticker,
                        id: stickerAttachment.id.toString(),
                        url: images[images.length - 3].url
                    });
                    break;
                }
                case "document": {
                    const documentAttachment = attachment as DocumentAttachment;
                    const type =
                        documentAttachment.typeId === 3
                            ? AttachmentType.Animation
                            : AttachmentType.Document;
                    result.push({
                        type,
                        id: documentAttachment.toString(),
                        url: documentAttachment.url
                    });
                    break;
                }
            }
        }
        return result;
    }

    private createForwardedMessage(message: MessageContext): ForwardedMessage {
        return {
            text: message.text ?? undefined,
            controllerName: this.name,
            attachments: this.extractAttachments(message.attachments),
            channel: this.createChannel(-1),
            account: this.createAccount(message.senderId),
            forwarded: message.forwards.map(this.createForwardedMessage.bind(this)),
            metadata: { messageIds: [-1] }
        };
    }

    private async createReplyMessage(
        channel: ChannelInfo,
        replyMessage: MessageContext | undefined
    ): Promise<InMessage | undefined> {
        if (!replyMessage) {
            return;
        }
        return {
            text: replyMessage.text!,
            attachments: this.extractAttachments(replyMessage.attachments),
            channel,
            account: await this.resolveAccount(replyMessage.senderId),
            forwarded: [],
            metadata: {
                globalId: replyMessage.id,
                messageIds: [replyMessage.conversationMessageId!]
            }
        };
    }

    private async createMessage(
        context: MessageContext<Record<string, unknown>>
    ): Promise<InMessage> {
        const channel = await this.resolveChannel(context.peerId);
        return {
            text: context.text ?? undefined,
            attachments: this.extractAttachments(context.attachments),
            channel,
            account: await this.resolveAccount(context.senderId),
            forwarded: context.forwards.flatten.map(x => this.createForwardedMessage(x)),
            reply: await this.createReplyMessage(channel, context.replyMessage),
            metadata: {
                globalId: context.id,
                messageIds: [context.conversationMessageId!]
            }
        };
    }
}
