import { assert } from "@replikit/core";
import { Constructor, HasFields, MessageMetadata, SafeFunction } from "@replikit/core/typings";
import { OutMessageLikeAsync } from "@replikit/messages/typings";
import { MessageContext } from "@replikit/router";
import { createSessionKey } from "@replikit/sessions";
import {
    resolveViewOutMessage,
    ViewNotRegisteredError,
    ViewSession,
    viewStorage
} from "@replikit/views";
import { ViewProps } from "@replikit/views/typings";

export abstract class View extends MessageContext {
    private metadata?: MessageMetadata;

    /** @internal */
    _data: HasFields;

    /** @internal */
    _session?: ViewSession;

    private updateRequested: boolean;
    private viewChangeRequested: boolean;

    protected closed: boolean;

    abstract render(): OutMessageLikeAsync;
    renderClosed?(): OutMessageLikeAsync;

    /** @internal */
    async updateWorker(): Promise<void> {
        const renderResult =
            this.closed && this.renderClosed ? await this.renderClosed() : await this.render();
        const [message, actions] = resolveViewOutMessage(this.constructor.name, renderResult);
        if (!this.metadata) {
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
    async _load(write = false): Promise<void> {
        assert(this.metadata, "Unable to load view without metadata");
        const messageId = this.metadata.messageIds[0];
        const sessionKey = createSessionKey(
            this.controller.name,
            ViewSession,
            this.channel.id,
            messageId
        );
        if (!this._session) {
            this._session = await this.getSession(ViewSession, sessionKey);
            if (write) {
                this._session.data = this._data;
            } else {
                this._data = this._session.data;
            }
        }
    }
}
