import {
    Controller,
    AttachmentType,
    config,
    assert,
    ChannelType,
    TextTokenProp,
    TextTokenKind,
    TextFormatter
} from "@replikit/core";
import {
    ResolvedMessage,
    SendedMessage,
    AccountInfo,
    ChannelInfo,
    Attachment,
    InMessage,
    MessageMetadata,
    ResolvedAttachment
} from "@replikit/core/typings";
import {
    Client,
    Message,
    TextChannel,
    MessageAttachment,
    Collection,
    User,
    Channel,
    GuildChannelType,
    Attachment as DiscordAttachment
} from "discord.js";
import { extname } from "path";
import { WebhookStorage } from "@replikit/discord";
import { TextTokenizer } from "@replikit/core";

const allowedTextTypes = ["text", "dm", "group"];

function assertTextChannel(channel: Channel): asserts channel is TextChannel {
    assert(allowedTextTypes.includes(channel.type), "Replikit supports only text channels");
}

export class DiscordController extends Controller {
    readonly backend: Client;

    private loggedIn: boolean;
    private readonly webhookStorage: WebhookStorage;

    constructor() {
        const textTokenizer = new TextTokenizer()
            .addTextPropRule("*", TextTokenProp.Italic)
            .addTextPropRule("_", TextTokenProp.Italic)
            .addTextPropRule("**", TextTokenProp.Bold)
            .addTextPropRule("__", TextTokenProp.Underline)
            .addTextPropRule("~~", TextTokenProp.Strikethrough)
            .addTextPropRule("`", TextTokenProp.InlineCode)
            .addTextPropRule("```", TextTokenProp.Code)
            .addRegexRule(/<@(?:!|&|#)?(\d*)>/, groups => ({
                kind: TextTokenKind.Mention as const,
                id: this.createId(groups[1]),
                props: []
            }));

        const textFormatter = new TextFormatter()
            .addPropFormatter(TextTokenProp.Italic, "_")
            .addPropFormatter(TextTokenProp.Bold, "*")
            .addPropFormatter(TextTokenProp.InlineCode, "`")
            .addPropFormatter(TextTokenProp.Code, "```")
            .addPropFormatter(TextTokenProp.Strikethrough, "~~")
            .addPropFormatter(TextTokenProp.Underline, "__")
            .addVisitor(TextTokenKind.Link, token => {
                return `[${token.text}](${token.props})`;
            })
            .addVisitor(TextTokenKind.Mention, token => {
                if (token.id) {
                    return `<@${token.id}>`;
                }
                assert(token.username, "Unable to mention user without id or username");
                return `@${token.username}`;
            });

        super({
            name: "dc",
            features: { implicitUpload: true },
            textTokenizer,
            textFormatter
        });

        this.webhookStorage = new WebhookStorage();
        this.backend = new Client();

        this.backend.on("message", message => {
            if (!message.author.bot) {
                const inMessage = this.createMessage(message);
                this.processMessageEvent("message:received", inMessage);
            }
        });

        this.backend.on("messageUpdate", message => {
            if (!message.author.bot) {
                const inMessage = this.createMessage(message);
                this.processMessageEvent("message:edited", inMessage);
            }
        });

        this.backend.on("messageDelete", message => {
            if (!message.author.bot) {
                const inMessage = this.createMessage(message);
                this.processMessageEvent("message:deleted", inMessage);
            }
        });

        this.backend.on("guildMemberAdd", member => {
            const channel = this.createChannel(member.guild.defaultChannel);
            const account = this.createAccount(member.user);
            this.processEvent("member:joined", { channel, account });
        });

        this.backend.on("guildMemberRemove", member => {
            const channel = this.createChannel(member.guild.defaultChannel);
            const account = this.createAccount(member.user);
            this.processEvent("member:left", { channel, account });
        });
    }

    async start(): Promise<void> {
        if (!this.loggedIn) {
            await this.backend.login(config.discord.token);
            this.loggedIn = true;
        }
    }

    stop(): Promise<void> {
        return Promise.resolve();
    }

    fetchChannelInfo(localId: number): Promise<ChannelInfo | undefined> {
        const channel = this.backend.channels.get(localId.toString());
        return Promise.resolve(channel ? this.createChannel(channel as TextChannel) : channel);
    }

    fetchAccountInfo(localId: number): Promise<AccountInfo | undefined> {
        const user = this.backend.users.get(localId.toString());
        return Promise.resolve(user ? this.createAccount(user) : user);
    }

    private getChannel(channelId: number): TextChannel {
        const channel = this.backend.channels.get(channelId.toString());
        assert(channel, "Channel inaccesible");
        assertTextChannel(channel);
        return channel;
    }

    checkWebhookPermission(channelId: number): boolean {
        const channel = this.getChannel(channelId);
        const permissions = channel.memberPermissions(channel.guild.me);
        if (!permissions) {
            return false;
        }
        return permissions.has("MANAGE_WEBHOOKS");
    }

    async deleteMessage(channelId: number, metadata: MessageMetadata): Promise<void> {
        const channel = this.getChannel(channelId);
        const promises = metadata.messageIds.map(async x => {
            const message = await channel.fetchMessage(x.toString());
            await message.delete();
        });
        await Promise.all(promises);
    }

    private createAttachmentContent(attachment: ResolvedAttachment): string | DiscordAttachment {
        return attachment.source === attachment.url
            ? new DiscordAttachment(attachment.url)
            : attachment.source;
    }

    protected async sendResolvedMessage(
        channelId: number,
        message: ResolvedMessage
    ): Promise<SendedMessage> {
        const channel = this.getChannel(channelId);
        const result: SendedMessage = { attachments: [], metadata: { messageIds: [] } };

        const types = [AttachmentType.Photo, AttachmentType.Sticker];
        const attachments = message.attachments.filter(x => types.includes(x.type));

        if (message.header) {
            const webhook = await this.webhookStorage.resolve(channel);
            const options = {
                username: message.header.username,
                avatarURL: message.header.avatar
            };

            if (message.text) {
                const sended = await webhook.send(message.text, options);
                assert(!Array.isArray(sended), "Unexpected webhook.send result");
                result.metadata.messageIds.push(this.createId(sended.id));
            }

            for (const attachment of attachments) {
                const content = this.createAttachmentContent(attachment);
                const data = typeof content === "string" ? content : void 0;
                const file = typeof content === "string" ? void 0 : content;
                const sended = await webhook.send(data, { ...options, file });
                result.metadata.messageIds.push(...this.createMessageIds(sended));
                assert(!Array.isArray(sended), "Unexpected webhook.send result");
                const sendedAttachment = sended.attachments.first();
                if (!sendedAttachment) continue;
                result.attachments.push({
                    id: sendedAttachment.id,
                    origin: attachment,
                    uploadId: sendedAttachment.url
                });
            }

            return result;
        }

        if (message.text) {
            const sended = await channel.send(message.text);
            result.metadata.messageIds.push(this.createId(sended.id));
        }

        for (const attachment of attachments) {
            const content = this.createAttachmentContent(attachment);
            const sended = await channel.send(content);
            result.metadata.messageIds.push(this.createId(sended.id));
            const sendedAttachment = sended.attachments.first();
            if (!sendedAttachment) continue;
            result.attachments.push({
                id: sendedAttachment.id,
                origin: attachment,
                uploadId: sendedAttachment.url
            });
        }

        return result;
    }

    protected async editResolvedMessage(
        channelId: number,
        message: ResolvedMessage
    ): Promise<SendedMessage> {
        const channel = this.getChannel(channelId);
        assert(message.metadata);
        assert(message.text);
        // TODO edit message attachments
        const msg = await channel.fetchMessage(message.metadata.messageIds[0].toString());
        const result = await msg.edit(message.text);
        return { metadata: { messageIds: [this.createId(result.id)] }, attachments: [] };
    }

    private createId(id: string): number {
        return (BigInt(id) as unknown) as number;
    }

    private createMessageIds(message: Message | Message[]): number[] {
        if (Array.isArray(message)) {
            return message.map(x => this.createId(x.id));
        }
        return [this.createId(message.id)];
    }

    private createMessage(message: Message): InMessage {
        return {
            text: message.content,
            account: this.createAccount(message.author),
            channel: this.createChannel(message.channel),
            attachments: this.extractAttachments(message.attachments),
            forwarded: [],
            metadata: { messageIds: [this.createId(message.id)] }
        };
    }

    private getAttachmentType(attachment: MessageAttachment): AttachmentType {
        const extension = extname(attachment.filename);
        switch (extension) {
            case ".png":
            case ".jpg":
            case ".jpeg":
                return AttachmentType.Photo;
            case ".gif":
                return AttachmentType.Document;
        }
        return null!;
    }

    // Override internal core _resolveSource
    protected _resolveSource(
        channelId: number,
        attachment: Attachment
    ): Promise<string | undefined> {
        const source =
            attachment.controllerName === this.name
                ? attachment.uploadId ?? attachment.url!
                : attachment.url!;
        return Promise.resolve(source);
    }

    private extractAttachments(attachments: Collection<string, MessageAttachment>): Attachment[] {
        return attachments.map(x => ({
            type: this.getAttachmentType(x),
            id: x.id,
            url: x.url
        }));
    }

    private createChannel(channel: Channel): ChannelInfo {
        assertTextChannel(channel);
        const permissions = channel.permissionsFor(this.backend.user);
        const manageMessages = permissions?.has("MANAGE_MESSAGES") ?? false;
        return {
            id: this.createId(channel.id),
            title: channel.name,
            permissions: {
                sendMessages: permissions?.has("SEND_MESSAGES") ?? false,
                deleteMessages: true,
                editMessages: true,
                deleteOtherMessages: manageMessages
            },
            type: this.createChannelType(channel.type)
        };
    }

    private createChannelType(type: "dm" | "group" | GuildChannelType): ChannelType {
        switch (type) {
            case "dm":
                return ChannelType.Direct;
            case "group":
            case "text":
                return ChannelType.Group;
            case "news":
                return ChannelType.PostChannel;
        }
        return ChannelType.Unknown;
    }

    private createAccount(account: User): AccountInfo {
        return {
            id: this.createId(account.id),
            firstName: account.username,
            username: account.tag,
            avatarUrl: account.avatarURL
        };
    }
}
