import { MessageBuilder } from "@replikit/messages";
import { AttachmentType, TextTokenKind } from "@replikit/core";

describe("MessageBuilder", () => {
    it("should create a message with text", () => {
        const message = new MessageBuilder()
            .addText("firstLine - ")
            .addLine("firstLine")
            .addText("secondLine")
            .build();
        expect(message).toMatchSnapshot();
    });

    it("should create a message with code", () => {
        const message = new MessageBuilder().addCode("code").build();
        expect(message).toMatchSnapshot();
    });

    it("should create a message with an attachment", () => {
        const message = new MessageBuilder()
            .addAttachment({ id: "test", type: AttachmentType.Photo })
            .build();
        expect(message).toMatchSnapshot();
    });

    it("should create a message with an array of attachments", () => {
        const message = new MessageBuilder()
            .addAttachments([{ id: "test", type: AttachmentType.Photo }])
            .build();
        expect(message).toMatchSnapshot();
    });

    it("should create a message with an attachment by url", () => {
        const message = new MessageBuilder()
            .addAttachmentByUrl(AttachmentType.Photo, "https://path/to/attachment.png")
            .build();
        expect(message).toMatchSnapshot();
    });

    it("should create a message with reply", () => {
        const message = new MessageBuilder().addReply({ messageIds: [123] }).build();
        expect(message).toMatchSnapshot();
    });

    it("should create a message with an array of tokens", () => {
        const message = new MessageBuilder()
            .addTokens([{ kind: TextTokenKind.Text, text: "test", props: [] }])
            .build();
        expect(message).toMatchSnapshot();
    });
});
