import "@replikit/attachments";
import { ControllerExtension } from "@replikit/attachments";
import { TestController, DatabaseTestManager, TestControllerOptions } from "@replikit/test-utils";
import { AttachmentType } from "@replikit/core";
import { SendedMessage } from "@replikit/core/typings";
import { Attachment } from "@replikit/attachments/typings";
import { fromAttachment } from "@replikit/messages";

let testManager: DatabaseTestManager;

beforeEach(() => {
    testManager = new DatabaseTestManager();
    return testManager.connect();
});

afterEach(() => {
    return testManager.close();
});

function createExtension(options?: TestControllerOptions): ControllerExtension {
    const extension = (new TestController(options) as unknown) as ControllerExtension;
    extension.connection = testManager.connection;
    return extension;
}

function createSendedMessage(): SendedMessage {
    return {
        attachments: [
            {
                id: "1",
                uploadId: "uploadId",
                origin: {
                    id: "123",
                    source: "123",
                    controllerName: "another",
                    type: AttachmentType.Photo
                }
            }
        ],
        metadata: { messageIds: [1] }
    };
}

describe("ControllerExtension", () => {
    it("should do nothing if controller didn't return sended attachment", async () => {
        const controller = createExtension();
        await controller.sendMessage(1, fromAttachment({ id: "123", type: AttachmentType.Photo }));

        const collection = testManager.connection //
            .getRawCollection<Attachment>("attachments");

        const attachments = await collection.find().toArray();
        expect(attachments).toHaveLength(0);
        expect.assertions(1);
    });

    it("should do nothing if controllerName matches the controller", async () => {
        const message = createSendedMessage();
        const controller = createExtension({ sendedMessage: message });
        const outMessage = fromAttachment({
            id: "123",
            controllerName: "test",
            type: AttachmentType.Photo
        });
        await controller.sendMessage(1, outMessage);

        const collection = testManager.connection //
            .getRawCollection<Attachment>("attachments");

        const attachments = await collection.find().toArray();
        expect(attachments).toHaveLength(0);
        expect.assertions(1);
    });

    it("should save attachment returned from controller", async () => {
        const message = createSendedMessage();
        const controller = createExtension({ sendedMessage: message });
        const outMessage = fromAttachment({
            id: "123",
            controllerName: "another",
            type: AttachmentType.Photo
        });
        await controller.sendMessage(1, outMessage);

        const collection = testManager.connection //
            .getRawCollection<Attachment>("attachments");

        const attachments = await collection.find().toArray();
        expect(attachments).toHaveLength(1);
        expect(attachments[0]).toMatchSnapshot();
        expect.assertions(2);
    });

    it("should append the source to existing attachment", async () => {
        const collection = testManager.connection //
            .getRawCollection<Attachment>("attachments");

        await collection.insertOne({
            _id: {
                controller: "another",
                localId: "123"
            },
            sources: [
                {
                    controller: "anotherTest",
                    localId: "1",
                    uploadId: "uploadId"
                }
            ]
        });

        const message = createSendedMessage();
        const controller = createExtension({ sendedMessage: message });
        const outMessage = fromAttachment({
            id: "123",
            controllerName: "another",
            type: AttachmentType.Photo
        });
        await controller.sendMessage(1, outMessage);

        const attachments = await collection.find().toArray();
        expect(attachments).toHaveLength(1);
        expect(attachments[0]).toMatchSnapshot();
        expect.assertions(2);
    });

    it("should use the stored attachment source", async () => {
        const collection = testManager.connection //
            .getRawCollection<Attachment>("attachments");

        await collection.insertOne({
            _id: {
                controller: "another",
                localId: "123"
            },
            sources: [
                {
                    controller: "test",
                    localId: "1",
                    uploadId: "uploadId"
                }
            ]
        });

        const controller = createExtension();
        const source = await controller["resolveSource"](1, {
            id: "123",
            controllerName: "another",
            type: AttachmentType.Photo
        });
        expect(source).toBe("uploadId");
    });
});
