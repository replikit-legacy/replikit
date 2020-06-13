import { fromText, fromCode } from "@replikit/messages";

describe("shortcuts", () => {
    it("should create a message with text", () => {
        const message = fromText("test");
        expect(message).toMatchSnapshot();
    });

    it("should create a message with code", () => {
        const message = fromCode("test");
        expect(message).toMatchSnapshot();
    });
});
