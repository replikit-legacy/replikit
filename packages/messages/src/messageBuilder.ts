import {
    OutMessage,
    Attachment,
    TextToken,
    MessageMetadata
} from "@replikit/core/typings";
import { AttachmentType, TextTokenKind, TextTokenProp } from "@replikit/core";
import { hashString } from "@replikit/messages";

export class MessageBuilder {
    protected readonly message: OutMessage = {
        forwarded: [],
        attachments: [],
        tokens: []
    };

    addReply(messageId: number | undefined): this {
        this.message.reply = messageId;
        return this;
    }

    useMetadata(metadata: MessageMetadata): this {
        this.message.metadata = metadata;
        return this;
    }

    addToken(token: TextToken): this {
        this.message.tokens.push(token);
        return this;
    }

    addTokens(tokens: TextToken[]): this {
        this.message.tokens.push(...tokens);
        return this;
    }

    addCode(code: string): this {
        return this.addText(code, [TextTokenProp.Monospace]);
    }

    addText(text: string, props?: TextTokenProp[]): this {
        return this.addToken({
            kind: TextTokenKind.Text,
            text,
            props: props ?? []
        });
    }

    addCodeLine(line: string): this {
        return this.addCode(line + "\n");
    }

    addCodeLines(lines: string[]): this {
        return this.addCode(lines.join("\n") + "\n");
    }

    addLine(line: string): this {
        return this.addText(line + "\n");
    }

    addLines(lines: string[]): this {
        return this.addText(lines.join("\n") + "\n");
    }

    addAttachmentByUrl(type: AttachmentType, url: string): this {
        this.message.attachments.push({ type, id: hashString(url), url });
        return this;
    }

    addAttachment(attachment: Attachment): this {
        this.message.attachments.push(attachment);
        return this;
    }

    addAttachments(attachments: Attachment[]): this {
        this.message.attachments.push(...attachments);
        return this;
    }

    build(): OutMessage {
        return this.message;
    }
}
