import { OutMessage, Attachment, TextToken, MessageHeader, Button } from "@replikit/core/typings";
import { AttachmentType, TextTokenKind, TextTokenProp, Builder } from "@replikit/core";
import { hashString, MetadataLike, extractMetadata } from "@replikit/messages";

export class MessageBuilder extends Builder {
    protected readonly message: OutMessage = {
        forwarded: [],
        attachments: [],
        tokens: [],
        buttons: []
    };

    addReply(metadata: MetadataLike): this {
        this.message.reply = extractMetadata(metadata);
        return this;
    }

    addHeader(header: MessageHeader): this {
        this.message.header = header;
        return this;
    }

    useMetadata(metadata: MetadataLike): this {
        this.message.metadata = extractMetadata(metadata);
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
        return this.addText(code, [TextTokenProp.Code]);
    }

    addText(text: string, props?: TextTokenProp[]): this {
        return this.addToken({
            kind: TextTokenKind.Text,
            text,
            props: props ?? []
        });
    }

    addCodeLine(line?: string): this {
        return this.addCode(line ? line + "\n" : "\n");
    }

    addCodeLines(lines: string[]): this {
        return this.addCode(lines.join("\n") + "\n");
    }

    addLine(line?: string): this {
        return this.addText(line ? line + "\n" : "\n");
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

    addButtonWithPayload(text: string, payload: string): this {
        this.message.buttons.push({ text, payload });
        return this;
    }

    addButtonWithUrl(text: string, url: string): this {
        this.message.buttons.push({ text, url });
        return this;
    }

    addButton(button: Button): this {
        this.message.buttons.push(button);
        return this;
    }

    build(): OutMessage {
        return this.message;
    }
}
