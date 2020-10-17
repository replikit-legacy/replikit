import { assert } from "@replikit/core";
import { Constructor, HasFields, MessageMetadata, SafeFunction } from "@replikit/core/typings";
import { resolveOutMessage } from "@replikit/messages";
import { OutMessageLikeAsync } from "@replikit/messages/typings";
import { MessageContext } from "@replikit/router";
import { SessionKey } from "@replikit/sessions/typings";
import {
    resolveViewOutMessage,
    ViewNotRegisteredError,
    ViewPattern,
    ViewSession,
    viewStorage
} from "@replikit/views";
import { ViewProps, ViewTarget } from "@replikit/views/typings";

export abstract class View extends MessageContext {
    private metadata?: MessageMetadata;

    /** @internal */
    _data: HasFields;

    /** @internal */
    _session?: ViewSession;

    private updateRequested: boolean;
    private viewChangeRequested: boolean;

    /** @internal */
    _resolvedByPattern: boolean;

    protected closed: boolean;

    patterns?: Record<string, ViewPattern>;

    abstract render(): OutMessageLikeAsync;
    renderClosed?(): OutMessageLikeAsync;
    renderTextFallback?(): OutMessageLikeAsync;

    /** @internal */
    _target?: ViewTarget;

    get target(): ViewTarget | undefined {
        return this._session?.target;
    }

    /**
     * Allow only the user who created the view or who is the target of the view to interact with it.
     */
    authenticate?: boolean;

    /** @internal */
    async updateWorker(): Promise<void> {
        const renderResult =
            this.closed && this.renderClosed ? await this.renderClosed() : await this.render();
        const [message, actions] = resolveViewOutMessage(this.constructor.name, renderResult);
        if (!this.metadata) {
            if (!this.controller.features.inlineButtons) {
                message.buttons = [];
                if (this.renderTextFallback && !this.closed) {
                    const fallbackMessage = resolveOutMessage(await this.renderTextFallback());
                    const firstToken = fallbackMessage.tokens[0];
                    if (firstToken?.text) {
                        firstToken.text = "\n" + firstToken.text;
                    }
                    message.tokens.push(...fallbackMessage.tokens);
                }
            }
            const sended = await this.controller.sendMessage(this.channel.id, message);
            this.metadata = sended.metadata;
            await this._load(true);
            this._session!.actions = actions;
            await this._session!.save();
        } else {
            this._session!.actions = actions;
            await this._session!.save();
            message.metadata = this.metadata;
            const sended = await this.controller.editMessage(this.channel.id, message);
            this.metadata = sended.metadata;
        }
    }

    /** @internal */
    _invoke(name: string, ...args: unknown[]): unknown {
        return ((this as HasFields)[name] as SafeFunction)(...args);
    }

    changeView<T extends View>(view: Constructor<T>, props?: ViewProps<T>): void {
        if (this.viewChangeRequested) {
            return;
        }
        this.viewChangeRequested = true;
        const resolvedView = viewStorage.resolve(this, view.name, this.metadata);
        if (!resolvedView) {
            throw new ViewNotRegisteredError(view.name);
        }
        resolvedView._session = this._session;
        resolvedView._session!.data = props ?? {};
        resolvedView._data = props ?? {};
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setImmediate(resolvedView.updateWorker.bind(resolvedView));
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
        await this._session?.reset();
        if (update) {
            await this.updateWorker();
        }
    }

    /**
     * Removes the view state from database to make it completely inaccessible.
     * @param update Update the view. `true` by default.
     */
    close(update?: boolean): void {
        if (this.closed) {
            return;
        }
        this.closed = true;
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        setImmediate(this.closeWorker.bind(this, update ?? true));
    }

    /** @internal */
    async _load(write = false): Promise<boolean> {
        if (!this._session) {
            if (this._resolvedByPattern) {
                this._session = await this.findSession(ViewSession);
                if (!this._session) {
                    return false;
                }
            } else {
                assert(this.metadata, "Unable to load view without metadata");
                const messageId = this.metadata.messageIds[0];
                const sessionKey: SessionKey = {
                    namespace: ViewSession.namespace,
                    controller: this.controller.name,
                    type: ViewSession.type,
                    channelId: this.channel.id,
                    messageId
                };
                this._session = await this.getSession(ViewSession, sessionKey);
            }
        }
        if (write) {
            this._session.data = this._data;
            if (this.authenticate) {
                this._session.target = this._target ?? {
                    controller: this.controller.name,
                    accountId: this.account.id
                };
            }
        } else {
            this._data = this._session.data;
        }
        return true;
    }
}
