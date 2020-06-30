import { Controller, Extension } from "@replikit/core";
import { AttachmentSource, Attachment, AttachmentId } from "@replikit/attachments/typings";
import { Attachment as CoreAttachment, SendedMessage } from "@replikit/core/typings";
import {
    BulkWriteUpdateOneOperation,
    BulkWriteInsertOneOperation,
    BulkWriteOperation
} from "mongodb";
import { ConnectionManager, connection } from "@replikit/storage";

function createGlobalId(attachment: CoreAttachment): AttachmentId {
    return { controller: attachment.controllerName, localId: attachment.id };
}

interface AwaitingAttachment {
    attachment: Attachment;
    exists: boolean;
}

function byAttachmentId(id: AttachmentId): (x: AwaitingAttachment) => boolean {
    return (x): boolean =>
        // eslint-disable-next-line eqeqeq
        x.attachment._id.controller == id.controller && x.attachment._id.localId === id.localId;
}

@Extension
export abstract class ControllerExtension extends Controller {
    connection?: ConnectionManager;
    private awaiting: AwaitingAttachment[];

    protected async processSendedMessage(message: SendedMessage): Promise<SendedMessage> {
        const operations: BulkWriteOperation<Attachment>[] = [];
        for (const attachment of message.attachments) {
            const id = createGlobalId(attachment.origin);
            const source: AttachmentSource = {
                controller: this.name,
                localId: attachment.id,
                uploadId: attachment.uploadId
            };

            const index = this.awaiting?.findIndex(byAttachmentId(id));
            if (index === undefined || index === -1) {
                continue;
            }

            const awaiting = this.awaiting[index];
            if (!awaiting.exists) {
                awaiting.attachment.sources.push(source);
                const operation: BulkWriteInsertOneOperation<Attachment> = {
                    insertOne: { document: awaiting.attachment }
                };
                operations.push(operation);
            } else {
                const operation: BulkWriteUpdateOneOperation<Attachment> = {
                    updateOne: {
                        filter: { _id: id },
                        update: { $push: { sources: source } }
                    }
                };
                operations.push(operation);
            }

            this.awaiting.splice(index, 1);
        }

        if (operations.length) {
            const collection = (this.connection ?? connection) //
                .getRawCollection<Attachment>("attachments");
            await collection.bulkWrite(operations);
        }

        return message;
    }

    protected async resolveSource(
        channelId: number,
        attachment: CoreAttachment
    ): Promise<string | undefined> {
        if (attachment.controllerName === this.name) {
            return this._resolveSource(channelId, attachment);
        }

        const collection = (this.connection ?? connection) //
            .getRawCollection<Attachment>("attachments");

        const id = createGlobalId(attachment);
        const existing = await collection.findOne({ _id: id });

        if (!this.awaiting) {
            this.awaiting = [];
        }

        if (!existing) {
            this.awaiting.push({
                attachment: { _id: id, sources: [] },
                exists: false
            });
            return this._resolveSource(channelId, attachment);
        }

        const source = existing.sources.find(x => x.controller === this.name);
        if (!source) {
            this.awaiting.push({ attachment: existing, exists: true });
            return this._resolveSource(channelId, attachment);
        }

        return source.uploadId ?? source.localId;
    }
}
