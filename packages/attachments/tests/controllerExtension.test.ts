import "@replikit/attachments";
import { ControllerExtension } from "@replikit/attachments";
import {
    TestController,
    DatabaseTestManager,
    TestControllerOptions
} from "@replikit/test-utils";
import { AttachmentType } from "@replikit/core";
import { SendedMessage } from "@replikit/core/typings";
import { Attachment } from "@replikit/attachments/typings";

let testManager: DatabaseTestManager;

beforeEach(() => {
    testManager = new DatabaseTestManager();
    return testManager.connect();
});

afterEach(() => {
    return testManager.close();
});

function createExtension(options?: TestControllerOptions): ControllerExtension {
    const extension = (new TestController(
        options
    ) as unknown) as ControllerExtension;
    extension.connection = testManager.connection;
    return extension;
}

function createSendedMessage(): SendedMessage {
    return {
        id: 1,
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
        metadata: { firstAttachment: true, messageIds: [1] }
    };
}

describe("ControllerExtension", () => {
    it("should do nothing if controller don't return sended attachment", async () => {
        const controller = createExtension();
        await controller.sendMessage(1, {
            attachments: [{ id: "123", type: AttachmentType.Photo }],
            forwarded: [],
            tokens: []
        });

        const collection = testManager.connection //
            .getRawCollection<Attachment>("attachments");

        const attachments = await collection.find().toArray();
        expect(attachments).toHaveLength(0);
        expect.assertions(1);
    });

    it("should do nothing if controllerName matches the controller", async () => {
        const message = createSendedMessage();
        const controller = createExtension({ sendedMessage: message });
        await controller.sendMessage(1, {
            attachments: [
                {
                    id: "123",
                    type: AttachmentType.Photo,
                    controllerName: "test"
                }
            ],
            tokens: [],
            forwarded: []
        });

        const collection = testManager.connection //
            .getRawCollection<Attachment>("attachments");

        const attachments = await collection.find().toArray();
        expect(attachments).toHaveLength(0);
        expect.assertions(1);
    });

    it("should save attachment returned from controller", async () => {
        const message = createSendedMessage();
        const controller = createExtension({ sendedMessage: message });
        await controller.sendMessage(1, {
            attachments: [
                {
                    id: "123",
                    controllerName: "another",
                    type: AttachmentType.Photo
                }
            ],
            tokens: [],
            forwarded: []
        });

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
        await controller.sendMessage(1, {
            attachments: [
                {
                    id: "123",
                    controllerName: "another",
                    type: AttachmentType.Photo
                }
            ],
            tokens: [],
            forwarded: []
        });

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
