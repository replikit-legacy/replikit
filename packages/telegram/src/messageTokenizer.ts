import { TextToken } from "@replikit/core/typings";
import { MessageEntity } from "telegraf/typings/telegram-types";
import { TextTokenProp, TextTokenKind } from "@replikit/core";

export class MessageTokenizer {
    private currentEntity: MessageEntity;
    private lastIndex = 0;
    private props: TextTokenProp[] = [];
    private tokens: TextToken[] = [];
    private entities: MessageEntity[];

    constructor(private readonly text: string, entities: MessageEntity[]) {
        this.entities = this.sortEntities(entities);
    }

    tokenize(): TextToken[] {
        for (const entity of this.entities) {
            this.currentEntity = entity;
            if (entity.offset > this.lastIndex) {
                this.resetEntity();
                this.lastIndex = this.currentEntity.offset;
            }
            this.handleEntity();
        }
        if (this.text.length > this.lastIndex) {
            const text = this.text.slice(this.lastIndex, this.lastIndex + this.text.length);
            this.pushText(text);
        }
        return this.tokens;
    }

    private getTokenText(): string {
        return this.text.slice(
            this.currentEntity.offset,
            this.currentEntity.offset + this.currentEntity.length
        );
    }

    private resetEntity(): void {
        const text = this.text.slice(this.lastIndex, this.currentEntity.offset);
        this.pushText(text);
        this.resetLastIndex();
    }

    private pushText(text: string): void {
        if (text) {
            this.tokens.push({
                kind: TextTokenKind.Text,
                text,
                props: [...this.props]
            });
        }
        this.props = [];
    }

    private handleEntity(): void {
        switch (this.currentEntity.type) {
            case "text_link": {
                const tokenText = this.getTokenText();
                this.tokens.push({
                    kind: TextTokenKind.Link,
                    text: tokenText,
                    url: this.currentEntity.url!,
                    props: [...this.props]
                });
                this.resetEntity();
                break;
            }
            case "mention": {
                const tokenText = this.getTokenText();
                this.tokens.push({
                    kind: TextTokenKind.Mention,
                    username: tokenText.slice(1),
                    props: [...this.props]
                });
                this.resetEntity();
                break;
            }
            case "text_mention": {
                this.tokens.push({
                    kind: TextTokenKind.Mention,
                    id: this.currentEntity.user!.id,
                    props: [...this.props]
                });
                this.resetEntity();
                break;
            }
            case "bold": {
                this.props.push(TextTokenProp.Bold);
                break;
            }
            case "italic": {
                this.props.push(TextTokenProp.Italic);
                break;
            }
            case "underline": {
                this.props.push(TextTokenProp.Underline);
                break;
            }
            case "strikethrough": {
                this.props.push(TextTokenProp.Strikethrough);
                break;
            }
            case "code": {
                this.props.push(TextTokenProp.InlineCode);
                break;
            }
            case "pre": {
                this.props.push(TextTokenProp.Code);
                break;
            }
        }
    }

    private sortEntities(entities: MessageEntity[]): MessageEntity[] {
        const special = ["mention", "text_link", "text_mention"];
        return entities
            .sort(a => (special.includes(a.type) ? 1 : -1))
            .sort((a, b) => a.offset - b.offset);
    }

    private resetLastIndex(): void {
        this.lastIndex = this.currentEntity.offset + this.currentEntity.length;
    }
}
