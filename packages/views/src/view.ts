import {
    AccountInfo,
    ChannelInfo,
    HasFields,
    Identifier,
    MessageMetadata
} from "@replikit/core/typings";
import { OutMessageLikeAsync } from "@replikit/messages/typings";
import { ViewInfo } from "@replikit/views/typings";
import { MessageContext } from "@replikit/router";
import { createSessionKey } from "@replikit/sessions";
import { resolveViewOutMessage, ViewField, ViewSession } from "@replikit/views";

export abstract class View {
    private metadata?: MessageMetadata;
    private channelId: Identifier;
    private context: MessageContext;
    private info: ViewInfo;

    /** @internal */
    session?: ViewSession;

    protected get account(): AccountInfo {
        return this.context.account;
    }

    protected get channel(): ChannelInfo {
        return this.context.channel;
    }

    private updateRequested = false;

    protected closed: boolean;

    abstract render(): OutMessageLikeAsync;

    /** @internal */
    async updateWorker(): Promise<void> {
        const renderResult = await this.render();
        const [message, actions] = resolveViewOutMessage(this.constructor.name, renderResult);
        if (!this.metadata) {
            const sended = await this.context.controller.sendMessage(this.channelId, message);
            this.metadata = sended.metadata;
        } else {
            message.metadata = this.metadata;
            const sended = await this.context.controller.editMessage(this.channelId, message);
            this.metadata = sended.metadata;
        }
        await this.syncFields(true);
        this.session!.actions = actions;
        await this.session!.save();
    }

    update(): void {
        if (this.updateRequested) {
            return;
        }
        this.updateRequested = true;
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setImmediate(this.updateWorker.bind(this));
    }

    private async closeWorker(update: boolean): Promise<void> {
        await this.session?.reset();
        if (update) {
            await this.updateWorker();
        }
    }

    /**
     * Removes the view state from database to make it completely inaccessible.
     * @param update Update the view. `true` by default.
     */
    close(update = true): void {
        if (this.closed) {
            return;
        }
        this.closed = true;
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setImmediate(this.closeWorker.bind(this, update));
    }

    /** @internal */
    async syncFields(write = false, props: HasFields = {}): Promise<void> {
        const messageId = this.metadata?.messageIds[0];
        if (messageId) {
            const sessionKey = createSessionKey(
                this.context.controller.name,
                ViewSession,
                this.channelId,
                messageId
            );
            if (!this.session) {
                this.session = await this.context.getSession(ViewSession, sessionKey);
            }
            for (const field of this.info.fields) {
                if (write) {
                    this.session[field.name] = (this as HasFields)[field.name];
                } else {
                    (this as HasFields)[field.name] = this.session[field.name];
                }
            }
        } else {
            for (const field of this.info.fields) {
                (this as HasFields)[field.name] =
                    props[field.name] ??
                    (field.initial instanceof ViewField
                        ? (this as HasFields)[field.initial.name]
                        : field.initial);
            }
        }
    }
}
