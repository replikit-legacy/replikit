import {
    ChannelInfo,
    AccountInfo,
    InMessage,
    Attachment,
    ResolvedAttachment,
    SendedMessage,
    ResolvedMessage,
    TextToken,
    MessageEventName,
    ChannelPermissionMap,
    SendedAttachment,
    MessageMetadata
} from "@replikit/core/typings";
import Telegraf from "telegraf";
import {
    config,
    Controller,
    AttachmentType,
    chunk,
    ChannelType,
    groupBy,
    CacheManager,
    TextFormatter,
    TextTokenKind,
    TextTokenProp
} from "@replikit/core";
import {
    Chat,
    User,
    Message,
    File,
    Update,
    IncomingMessage,
    PhotoSize
} from "telegraf/typings/telegram-types";
import { TelegrafContext } from "telegraf/typings/context";
import { logger, MessageTokenizer, escapeHtml } from "@replikit/telegram";
import { Dice } from "@replikit/telegram/typings";

export class TelegramController extends Controller {
    private readonly bot: Telegraf<TelegrafContext>;
    private readonly startDate: number;
    private readonly permissionCache: CacheManager<
        number,
        ChannelPermissionMap
    >;

    constructor() {
        const textFormatter = new TextFormatter()
            .addPropFormatter(TextTokenProp.Bold, "<b>", "</b>")
            .addPropFormatter(TextTokenProp.Italic, "<i>", "</i>")
            .addPropFormatter(TextTokenProp.Underline, "<u>", "</u>")
            .addPropFormatter(TextTokenProp.Strikethrough, "<s>", "</s>")
            .addPropFormatter(TextTokenProp.Monospace, "<pre>", "</pre>")
            .addVisitor(TextTokenKind.Text, token => {
                return escapeHtml(token.text);
            })
            .addVisitor(TextTokenKind.Link, token => {
                return `<a href="${token.url}">${escapeHtml(token.text)}</a>`;
            })
            .addVisitor(TextTokenKind.Mention, token => {
                const text = escapeHtml(token.text ?? token.username ?? "");
                return `<a href="tg://user?id=${token.id}">${text}</a>`;
            });

        super({
            name: "tg",
            features: { implicitUpload: true },
            textFormatter
        });

        this.permissionCache = new CacheManager(
            this.fetchChannelPermissions.bind(this),
            config.core.cache.expire
        );

        if (!config.telegram?.token) {
            logger.fatal("Missing telegram token");
        }

        this.bot = new Telegraf(config.telegram.token);
        this.startDate = Math.floor(Date.now() / 1000);

        this.bot.handleUpdates = this.handleUpdates.bind(this);
    }

    private async handleMediaGroup(
        event: MessageEventName,
        messages: Message[]
    ): Promise<void> {
        const primary = messages[0];
        const message = await this.createMessage(primary);
        for (const mediaItem of messages.slice(1)) {
            const attachment = await this.resolveAttachment(mediaItem);
            if (attachment) {
                message.attachments.push(attachment);
            }
        }
        this.processMessageEvent(event, message);
    }

    private async handleUpdate(message: Message): Promise<boolean> {
        if (message.new_chat_members) {
            const channel = await this.createChannel(message.chat);
            for (const member of message.new_chat_members) {
                const account = this.createAccount(member);
                this.processEvent("account:joined", { channel, account });
            }
            return true;
        }

        if (message.left_chat_member) {
            const channel = await this.createChannel(message.chat);
            const account = this.createAccount(message.left_chat_member);
            this.processEvent("account:left", { channel, account });
            return true;
        }

        if (message.new_chat_title) {
            const channel = await this.createChannel(message.chat);
            this.processEvent("channel:title:edited", { channel });
            return true;
        }

        if (message.new_chat_photo) {
            const channel = await this.createChannel(message.chat);
            const photo = this.createPhotoAttachment(message.new_chat_photo);
            this.processEvent("channel:photo:edited", { channel, photo });
            return true;
        }

        if (message.delete_chat_photo) {
            const channel = await this.createChannel(message.chat);
            this.processEvent("channel:photo:deleted", { channel });
            return true;
        }

        return false;
    }

    private async handleMessages(
        event: MessageEventName,
        messages: Message[]
    ): Promise<void> {
        const mediaGroups = groupBy(messages, "media_group_id");
        for (const group of mediaGroups) {
            if (group.key !== "undefined") {
                await this.handleMediaGroup(event, group.value);
                continue;
            }
            for (const message of group.value) {
                await this.handleMediaGroup(event, [message]);
            }
        }
    }

    private async handleUpdates(updates: Update[]): Promise<unknown[]> {
        const receivedMessages: Message[] = [];
        const editedMessages: Message[] = [];
        for (const update of updates) {
            if (update.message) {
                if (update.message.date < this.startDate) {
                    continue;
                }
                const handled = await this.handleUpdate(update.message);
                if (!handled) {
                    receivedMessages.push(update.message);
                }
            }

            if (update.edited_message) {
                if (update.edited_message.edit_date! < this.startDate) {
                    continue;
                }
                editedMessages.push(update.edited_message);
                continue;
            }

            await this.bot.handleUpdate(update);
        }
        await this.handleMessages("message:received", receivedMessages);
        await this.handleMessages("message:edited", editedMessages);
        return (undefined as unknown) as unknown[];
    }

    private async fetchChannelPermissions(
        channelId: number
    ): Promise<ChannelPermissionMap> {
        const botMember = await this.bot.telegram.getChatMember(
            channelId,
            this.botId
        );
        if (!botMember) {
            return {
                deleteMessages: false,
                deleteOtherMessages: false,
                editMessages: false,
                sendMessages: false
            };
        }
        return {
            sendMessages: botMember.can_send_messages ?? false,
            deleteMessages: true,
            editMessages: true,
            deleteOtherMessages: botMember.can_delete_messages ?? false
        };
    }

    tokenizeText(message: InMessage): TextToken[] {
        if (!message.text || !message.telegram?.entities) {
            return [];
        }
        const tokenizer = new MessageTokenizer(
            message.text,
            message.telegram?.entities
        );
        return tokenizer.tokenize();
    }

    async start(): Promise<void> {
        const me = await this.bot.telegram.getMe();
        this._botId = me.id;
        await this.bot.launch();
    }

    async stop(): Promise<void> {
        await this.bot.stop();
    }

    async fetchChannelInfo(localId: number): Promise<ChannelInfo | undefined> {
        try {
            const chat = await this.bot.telegram.getChat(localId);
            return this.createChannel(chat);
        } catch {
            return undefined;
        }
    }

    async fetchAccountInfo(localId: number): Promise<AccountInfo | undefined> {
        try {
            const chat = await this.bot.telegram.getChat(localId);
            return {
                id: chat.id,
                firstName: chat.first_name,
                lastName: chat.last_name,
                username: chat.username,
                avatarUrl: chat.photo
                    ? await this.bot.telegram.getFileLink(
                          chat.photo.small_file_id
                      )
                    : undefined
            };
        } catch {
            return undefined;
        }
    }

    async sendResolvedMessage(
        channelId: number,
        message: ResolvedMessage
    ): Promise<SendedMessage> {
        let result: SendedMessage | undefined = undefined;
        let extra: Record<string, unknown> | undefined = {
            reply_to_message_id: message.reply
        };

        // Отправляем текст, если есть
        if (message.text) {
            const sended = await this.bot.telegram.sendMessage(
                channelId,
                message.text,
                {
                    parse_mode: "HTML",
                    disable_web_page_preview: true,
                    reply_to_message_id: message.reply
                }
            );
            extra = undefined;
            result = await this.createSendedMessage(sended);
        }

        // Сортируем вложения по типу
        const attachments = this.sortAttachments(message.attachments);

        // Отправляем фото и видео
        const media = attachments.filter(
            x =>
                x.type === AttachmentType.Photo ||
                x.type === AttachmentType.Video
        );

        if (media.length === 1) {
            // Отправляем один элемент
            const item = media[0];

            const sended = await (item.type === AttachmentType.Photo
                ? this.bot.telegram.sendPhoto(channelId, item.source, extra)
                : this.bot.telegram.sendVideo(channelId, item.source, extra));
            extra = undefined;
            if (!result) {
                result = await this.createSendedMessage(sended);
            }
        } else if (media.length) {
            // Отправляем медиа группу (или несколько групп)
            const mediaGroups = chunk(media, 10);
            for (const mediaGroup of mediaGroups) {
                const items = mediaGroup.map(x => ({
                    type: x.type === AttachmentType.Photo ? "photo" : "video",
                    media: x.source
                }));
                const sended = await this.bot.telegram.sendMediaGroup(
                    channelId,
                    items,
                    extra
                );
                extra = undefined;
                for (const [i, msg] of sended.entries()) {
                    if (i === 0 && !result) {
                        result = await this.createSendedMessage(msg);
                        continue;
                    }
                    result!.metadata.messageIds.push(msg.message_id);
                    const sendedAttachment = await this.createSendedAttachment(
                        msg,
                        mediaGroup[i]
                    );
                    result?.attachments.push(sendedAttachment);
                }
            }
        }

        // Отправляем прочие вложения
        const otherAttachments = attachments.filter(x => !media.includes(x));
        for (const [i, attachment] of otherAttachments.entries()) {
            const sended = await this.sendOtherAttachment(
                channelId,
                attachment,
                extra
            );
            extra = undefined;
            if (i === 0 && !result) {
                result = await this.createSendedMessage(sended);
                continue;
            }
            result!.metadata.messageIds.push(sended.message_id);
            const sendedAttachment = await this.createSendedAttachment(
                sended,
                attachment
            );
            result!.attachments.push(sendedAttachment);
        }

        // Отправляем пересланные сообщения
        for (const [i, forwarded] of message.forwarded.entries()) {
            const sended = await this.bot.telegram.forwardMessage(
                channelId,
                forwarded.channelId,
                forwarded.messageId
            );
            if (i === 0 && !result) {
                result = await this.createSendedMessage(sended);
                continue;
            }
            result!.metadata.messageIds.push(sended.message_id);
        }

        if (!result) {
            throw new Error("Empty content");
        }

        return result;
    }

    private sendOtherAttachment(
        channelId: number,
        attachment: ResolvedAttachment,
        extra: Record<string, unknown> | undefined
    ): Promise<Message> {
        switch (attachment.type) {
            case AttachmentType.Sticker: {
                if (attachment.controllerName === this.name) {
                    return this.bot.telegram.sendSticker(
                        channelId,
                        attachment.source,
                        extra
                    );
                }
                return this.bot.telegram.sendPhoto(
                    channelId,
                    attachment.source,
                    extra
                );
            }
            case AttachmentType.Voice: {
                return this.bot.telegram.sendVoice(
                    channelId,
                    attachment.source,
                    extra
                );
            }
            case AttachmentType.Document: {
                return this.bot.telegram.sendDocument(
                    channelId,
                    attachment.source,
                    extra
                );
            }
            default: {
                const type = AttachmentType[attachment.type];
                return this.bot.telegram.sendMessage(
                    channelId,
                    `<code>Unsupported attachment type: "${type}"</code>`,
                    { parse_mode: "HTML", ...extra }
                );
            }
        }
    }

    protected async editResolvedMessage(
        channelId: number,
        message: ResolvedMessage
    ): Promise<SendedMessage | undefined> {
        let result: SendedMessage | undefined = undefined;

        if (!message.metadata) {
            throw new Error("Metadata required");
        }

        const length =
            message.attachments.length +
            message.forwarded.length +
            (message.text ? 1 : 0);
        if (length !== message.metadata.messageIds.length) {
            throw new Error("Metadata messageIds length mismatch");
        }

        // Редактируем текст
        if (message.text) {
            if (message.metadata.firstAttachment) {
                throw new Error("Unable to update text");
            }
            const edited = await this.bot.telegram.editMessageText(
                channelId,
                message.metadata.messageIds[0],
                undefined,
                message.text
            );
            result = await this.createSendedMessage(edited as Message);
        }

        return result;
    }

    async deleteMessage(channelId: number, id: number): Promise<void> {
        await this.bot.telegram.deleteMessage(channelId, id);
    }

    private createAccount(user: User | Chat): AccountInfo {
        return {
            id: user.id,
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            language: (user as User).language_code
        };
    }

    private extractTitle(chat: Chat | User): string {
        return (
            (chat as Chat).title ??
            chat.username ??
            (chat.last_name
                ? `${chat.first_name} ${chat.last_name}`
                : chat.first_name!)
        );
    }

    private extractAttachment(
        message: IncomingMessage
    ): Attachment | undefined {
        if (message.photo) {
            return this.createPhotoAttachment(message.photo);
        }

        if (message.sticker) {
            return {
                id: message.sticker.file_id,
                type: AttachmentType.Sticker
            };
        }

        if (message.voice) {
            return { id: message.voice.file_id, type: AttachmentType.Voice };
        }

        if (message.document) {
            return {
                id: message.document.file_id,
                type: AttachmentType.Document
            };
        }

        if (message.video) {
            return { id: message.video.file_id, type: AttachmentType.Video };
        }

        return undefined;
    }

    private createPhotoAttachment(photo: PhotoSize[]): Attachment {
        const lastIndex = photo.length - 1;
        return {
            id: photo[lastIndex].file_id,
            type: AttachmentType.Photo
        };
    }

    private getFileUrl(path: string): string {
        return `https://api.telegram.org/file/bot${config.telegram.token}/${path}`;
    }

    private async resolveAttachment(
        message: Message
    ): Promise<Attachment | undefined> {
        const attachment = this.extractAttachment(message);
        if (!attachment) {
            return;
        }

        interface AttachmentFile extends File {
            file_unique_id: string;
        }

        const fileInfo = await this.bot.telegram.getFile(attachment.id);
        attachment.uploadId = attachment.id;
        attachment.id = (fileInfo as AttachmentFile).file_unique_id;
        attachment.url = this.getFileUrl(fileInfo.file_path!);
        return attachment;
    }

    private async extractAttachments(message: Message): Promise<Attachment[]> {
        const attachment = await this.resolveAttachment(message);
        return attachment ? [attachment] : [];
    }

    private async createChannel(chat: Chat | User): Promise<ChannelInfo> {
        if (this.isChat(chat)) {
            const permissions = await this.permissionCache.get(chat.id);
            return {
                id: chat.id,
                title: this.extractTitle(chat),
                type: this.resolveChatType(chat.type),
                permissions
            };
        }
        return {
            id: chat.id,
            title: this.extractTitle(chat),
            type: ChannelType.Direct,
            permissions: {
                deleteMessages: true,
                deleteOtherMessages: true,
                editMessages: true,
                sendMessages: true
            }
        };
    }

    private resolveChatType(type: string): ChannelType {
        switch (type) {
            case "private":
                return ChannelType.Direct;
            case "group":
            case "supergroup":
                return ChannelType.Group;
            case "channel":
                return ChannelType.PostChannel;
        }
        throw new Error("Unexpected channel type");
    }

    private isChat(chat: Chat | User): chat is Chat {
        return "type" in chat;
    }

    private async createSendedAttachment(
        message: Message,
        origin: ResolvedAttachment
    ): Promise<SendedAttachment> {
        const attachment = await this.resolveAttachment(message);
        return { id: attachment!.id, uploadId: attachment!.uploadId, origin };
    }

    private async createSendedMessage(
        message: Message,
        origin?: ResolvedAttachment
    ): Promise<SendedMessage> {
        if (!origin) {
            return {
                id: message.message_id,
                attachments: [],
                metadata: {
                    messageIds: [message.message_id],
                    firstAttachment: !message.text
                }
            };
        }
        const attachment = await this.createSendedAttachment(message, origin);
        return {
            id: message.message_id,
            attachments: [attachment],
            metadata: {
                messageIds: [message.message_id],
                firstAttachment: !message.text
            }
        };
    }

    private createMetadata(id: number): MessageMetadata {
        return {
            firstAttachment: false,
            messageIds: [id]
        };
    }

    private async createMessage(message: IncomingMessage): Promise<InMessage> {
        if (message.forward_from) {
            return {
                id: message.message_id,
                attachments: [],
                account: this.createAccount(message.from!),
                channel: await this.createChannel(message.chat),
                forwarded: [
                    {
                        id: message.forward_from_message_id!,
                        text: message.text || message.caption,
                        controllerName: this.name,
                        attachments: await this.extractAttachments(message),
                        account: this.createAccount(message.forward_from),
                        channel: await this.createChannel(
                            message.forward_from_chat ?? message.forward_from
                        ),
                        forwarded: [],
                        telegram: {
                            entities:
                                message.entities ?? message.caption_entities,
                            dice: message.dice as Dice
                        },
                        metadata: this.createMetadata(
                            message.forward_from_message_id!
                        )
                    }
                ],
                metadata: this.createMetadata(message.message_id)
            };
        }

        if (message.forward_from_chat) {
            return {
                id: message.message_id,
                attachments: [],
                account: this.createAccount(message.from!),
                channel: await this.createChannel(message.chat),
                forwarded: [
                    {
                        id: message.forward_from_message_id!,
                        text: message.text || message.caption,
                        controllerName: this.name,
                        attachments: await this.extractAttachments(message),
                        account: this.createAccount(message.forward_from_chat),
                        channel: await this.createChannel(
                            message.forward_from_chat
                        ),
                        forwarded: [],
                        telegram: {
                            entities:
                                message.entities ?? message.caption_entities,
                            dice: message.dice as Dice
                        },
                        metadata: this.createMetadata(
                            message.forward_from_message_id!
                        )
                    }
                ],
                metadata: this.createMetadata(message.message_id)
            };
        }

        return {
            id: message.message_id,
            text: message.text || message.caption,
            telegram: {
                entities: message.entities ?? message.caption_entities,
                dice: message.dice as Dice
            },
            attachments: await this.extractAttachments(message),
            account: this.createAccount(message.from!),
            channel: await this.createChannel(message.chat),
            metadata: this.createMetadata(message.message_id),
            reply: message.reply_to_message
                ? await this.createMessage(message.reply_to_message)
                : undefined,
            forwarded: []
        };
    }

    private sortAttachments(
        attachments: ResolvedAttachment[]
    ): ResolvedAttachment[] {
        return attachments.sort((a, b) => a.type - b.type);
    }
}
